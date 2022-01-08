const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function start() {
  for (let i = 1; i <= 20; i++) {
    console.log("page start", i);
    let res = await axios
      .get(
        "https://polygonscan.com/token/generic-tokenholders2?a=0xdf9B4b57865B403e08c85568442f95c26b7896b0&sid=&m=normal&s=3.1437370972E%2b24&p=" +
          i
      )
      .then((res) => res.data);
    const $ = cheerio.load(res);
    let data = $("tr a");
    let b = Array.from(data);
    let allAddress = [];
    b.forEach((it) => {
      let href = $(it).attr("href");
      if (!href.includes("tokenAnalytics")) {
        allAddress.push(href.slice(-42));
      }
    });
    fs.appendFileSync("user.json", JSON.stringify(allAddress) + "\r\n");
    await new Promise((r) => setTimeout(r, 1000));
    console.log("page end", i);
  }
}
start();
