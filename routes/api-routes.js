const db = require("../models"); // MongoDB interface
const passport = require("../config/passport"); // User Authentication
const axios = require("axios"); // Web Scraping
const cheerio = require("cheerio"); // HTML parser
const assert = require('assert').strict; // Error checking

module.exports = function (app) {

    app.get('/api/scrape', function (req, res) {

        // Track new articles added to db this time around
        let newArticleIds = [];
        let promises = [];

        console.log('Entered GET route for api/scrape')
        axios.get("https://www.apnews.com/apf-topnews").then((scrapedData) => {

            // Generate cheerio object
            const $ = cheerio.load(scrapedData.data);

            // Iterate through article cards
            $("div[data-key=feed-card-wire-story-with-image]").each(function (i, element) {

                // Create output object
                let articleInfo = {};

                // Pull info that does not need to be further parsed
                articleInfo.headline = $(this).children('div.CardHeadline').children('a[data-key=card-headline]').children('h1').text();
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
                if (articleInfo.headline && articleInfo.url && !articleInfo.url.includes('undefined')) {

                    // Insert into database via mongoose and return a promise object so we can track completion
                    let creationPromise = asyncMongooseCreate('Article', articleInfo, function (err, newArticle) {

                        // If there is an error due to a duplicate url being detected, ignore it.
                        // We don't want that added to the database, so getting rejected is fine.
                        // If any other type of error occures, logg it.
                        // Also if Mongo passes null to err, don't try to do anyting with it
                        if (err && err.code !== 11000) {

                            console.log('Database error during asynchMongooseCreate')
                            throw (err)

                        } else if (!err) {
                            // Track the fact that at least one piece of data was added during this scrape
                            newArticleIds.push(newArticle._id);

                            console.log('Successfully added new article to the database with id:');
                            console.log(newArticle._id)
                        } else {
                            console.log(`A duplicate was ignored during cycle ${i}`);
                        }
                    });

                    // Add that promise object to a list of all db operation promises from the loop
                    promises.push(creationPromise);

                };

                // Else do nothing

            });

            // Wait until all database operation have completed before responding to the client
            Promise.all(promises).then(() => {
                // Check whether or not the scrape added any new data to our database and respond accordingly
                if (newArticleIds.length > 0) { res.status(201).json(newArticleIds) }
                else { res.status(204).end() }
            }).catch((err) => {
                res.status(500).send(err);
            });


        }).catch((error) => {
            res.status(500).send(error);
            console.log(error);
            return;
        })

    });

};

const LocationRegEx = new RegExp('^[^\(]+');
const SummaryRegEx = new RegExp('—[^]+$');

function asyncMongooseCreate(model, dataPackage, callback) {
    return new Promise(function (resolve, reject) {
        db[model].create(dataPackage, function (err, newObject) {
            resolve(callback(err, newObject));

            // If any error happens it will triger reject automatically

        })
    })
}