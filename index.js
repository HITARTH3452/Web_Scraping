const axios = require("axios");
const cheerio = require("cheerio");
// const fs = require("node:fs");
const ExcelJS = require('exceljs');

// const xlsx = require("xlsx");

const pageUrl = "https://www.linkedin.com/feed/";

async function fetchHTML(url) {
    const { data } = await axios.get(url);
    return data;
}

async function scrapeAndStore() {
  const html = await fetchHTML(pageUrl);
  const $ = cheerio.load(html);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Languages");

  worksheet.columns = [
    { header: "Language Name", key: "name" },
    { header: "Locale", key: "locale" },
  ];

  $(".language-selector__item").each((index, element) => {
    const languageName = $(element)
      .find(".language-selector__link")
      .text()
      .trim();
    const locale = $(element)
      .find(".language-selector__link")
      .attr("data-locale");

    worksheet.addRow({ name: languageName, locale: locale });
  });

  await workbook.xlsx.writeFile("languages.xlsx");
  console.log("Language data stored in language.xlsx");
}

scrapeAndStore();