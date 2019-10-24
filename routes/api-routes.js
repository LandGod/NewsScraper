var db = require("../models");
var passport = require("../config/passport");
var assert = require('assert').strict;

module.exports = function (app) {

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

};