const passport = require("../config/passport"); // User Authentication
var assert = require('assert').strict;

module.exports = function (app) {

    // Passport login
    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });


    // Do stuff

};