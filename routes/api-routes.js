const db = require("../models"); // MongoDB interface
const passport = require("../config/passport"); // User Authentication
const axios = require("axios"); // Web Scraping
const cheerio = require("cheerio"); // HTML parser
const assert = require('assert').strict; // Error checking

module.exports = function (app) {

    app.get('/api/scrape', function (req, res) {

        // Just for debug:
        let allArticles = [];

        console.log('Entered GET route for api/scrape')
        axios.get("https://www.apnews.com/apf-topnews").then((scrapedData) => {

            // Generate cheerio object
            const $ = cheerio.load(scrapedData.data);

            // Iterate through article cards
            $("div[data-key=feed-card-wire-story-with-image]").each(function (i, element) {

                // Create output object
                let articleInfo = {};

                // Pull info that does not need to be further parsed
                articleInfo.title = $(this).children('div.CardHeadline').children('a[data-key=card-headline]').children('h1').text();
                articleInfo.publishDate = $(this).children('div.CardHeadline').children('div').children('span.Timestamp').attr('data-source');
                articleInfo.byline = $(this).children('div.CardHeadline').children('div').children('span.c0152').text() || "By Staff"
                articleInfo.url = "https://www.apnews.com" + $(this).children('div.CardHeadline').children('a[data-key=card-headline]').attr('href');

                // Grab text chunk that will need to be parsed
                // Split article text into location [0] and actual summar [1] by splitting on the (AP) byline
                let rawArticleText = $(this).children('a[data-key=story-link]').children('div.content').children('p').text().split(' (AP) — ');
                // Check to make sure splitting actually happened, if it didn't we just don't record anything for location
                if (rawArticleText.length > 1) {
                    articleInfo.location = rawArticleText[0];
                    articleInfo.summary = rawArticleText[1];
                } else {
                    articleInfo.summary = rawArticleText[0];
                }

                // Check that what we ended up with is useable data; If it isn't, continue to next loop
                if (articleInfo.title && articleInfo.url && !articleInfo.url.includes('undefined')) {
                    allArticles.push(articleInfo);
                } else { continue };

                //TODO: Add article to database

            });

            res.send(allArticles)

        }).catch((error) => {
            res.status(500).send('error');
            console.log(error);
            return;
        })

    });

};

const LocationRegEx = new RegExp('^[^\(]+');
const SummaryRegEx = new RegExp('—[^]+$');