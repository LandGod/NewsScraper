const passport = require("../config/passport"); // User Authentication
const db = require("../models"); // MongoDB interface
const moment = require('moment'); // Date/time parsing library
var assert = require('assert').strict;

module.exports = function (app) {

    // Passport login
    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });


    // Get main page
    app.get('/', function (req, res) {

        db.Article.find({publishDate: {$gt: moment().add(-1, 'days')}}).sort({publishDate: 'descending'})
            .then(function (resutls) {
                res.render("index", {
                    newsItems: resutls
                });
            })
            .catch(function (err) {
                console.log(err)
            });

    });

};