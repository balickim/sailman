const url = "https://www.kubryk.pl";

const subPages = [
  "https://www.kubryk.pl/rejsy/baltyk",
  "https://www.kubryk.pl/rejsy/morze-polnocne",
  "https://www.kubryk.pl/rejsy/grecja",
];

const cheerio = require("cheerio");
const fetch = require("node-fetch");
const Website = require("../models/websites");

class Website {
  constructor(url, subPage) {
    this.url = url;
    this.subPage = subPage;
  }
  static get() {
    Promise.all(
      subPages.map((url) =>
        fetch(url)
          .then((res) => res.text())
          .then((html) => {
            return this.loadAndFind(html);
          })
          .catch((err) => {
            console.log(err);
          })
      )
    ).then((data) => {
      // do something with the data
    });
  }

  static loadAndFind = (html) => {
    const $ = cheerio.load(html);
    let found = [];
    $("div[id='results']")
      .children("a")
      .attr("href")
      .each(function (i, el) {
        found.push({
          route: $(el)
            .children("div[class='col-md-12 item clearfix']")
            .each(function (i, e) {
              $(e).children("p[class='route-list']");
            }),
          link: $(el),
        });
      });
    return found;
  };

  static saveToDb() {
    this.get().then((data) => {
      let now = new Date().toISOString();
      console.log(now + " - " + url);
      data.forEach(function (el, i) {
        console.log("%ckubryk.js line:47 el", "color: #007acc;", el);
        let website = new Website({
          route: el.route,
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

module.exports = Website;
