const db = require("../models"); // MongoDB interface
const passport = require("../config/passport"); // User Authentication
const axios = require("axios"); // Web Scraping
const cheerio = require("cheerio"); // HTML parser
const assert = require('assert').strict; // Error checking

module.exports = function (app) {

    app.get('/api/scrape', function (req, res) {
        axios.get("https://www.apnews.com/").then((scrapedData) => {
            const $ = cheerio.load(scrapedData);

            // Iterate through articles
            $("div.c0169").each(function (i, element) {
                // Output object
                let aticleInfo = {};

                articleInfo.title = $(this).children('div.CardHeadline').children('a.c0129').children('h1').text();
                articleInfo.date = $(this).children('div.CardHeadline').children('div.c0131').children('span.Timestamp').attr('data-source');
                articleInfo.byline = $(this).children('div.CardHeadline').children('a.c0131').children('span.c0125').text();
                articleInfo.link = "https://www.apnews.com/" + $(this).children('div.CardHeadline').children('a.c0129').attr('href');

                // Split article text into location [0] and actual summar [1] by splitting on the (AP) byline
                let rawArticleText = $(this).children('a.c0174').children('div.content').children('p').text().split(' (AP) — ');
                // Check to make sure splitting actually happened, if it didn't we just don't record anything for location
                if (rawArticleText.length > 1) {
                    articleInfo.location = rawArticleText[1];
                }
                articleInfo.summary = rawArticleText[0];

                // Add to database
                //TODO: ...

            });

        });
    });

};

const LocationRegEx = new RegExp('^[^\(]+');
const SummaryRegEx = new RegExp('—[^]+$');