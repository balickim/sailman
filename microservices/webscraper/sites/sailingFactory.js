const url = "https://sailingfactory.pl/rejsy-morskie";

const cheerio = require("cheerio");
const fetch = require("node-fetch");
const Website = require("../models/websites");

class sailingFactory {
  static get() {
    return fetch(url)
      .then((res) => res.text())
      .then((html) => {
        return this.loadAndFind(html);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static loadAndFind = (html) => {
    const $ = cheerio.load(html);
    let found = [];
    $("div[class='cruise-col']")
      .children("div[class='cruise-entry']")
      .each(function (i, el) {
        found.push({
          title: $(el).children("h3").text(),
          link: $(el).children("a").attr("href"),
        });
      });
    return found;
  };

  static saveToDb() {
    this.get().then((data) => {
      let now = new Date().toISOString();
      console.log(now + " - " + url);
      data.forEach(function (el, i) {
        console.log(el.title);
        let website = new Website({
          title: el.title,
          link: el.link,
          siteUrl: url,
        });
        website.save((err, data) => {
          if (err) {
            console.error(err);
          }
        });
      });
    });
  }
}

module.exports = sailingFactory;
