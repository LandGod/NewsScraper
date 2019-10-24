// Requiring necessary npm packages for running server and rendering content
const express = require("express");
const session = require("express-session");
const exphbs = require('express-handlebars');

// Require package for database
const mongoose = require('mongoose');

// Require packages for web scraping
const cheerio = require('cheerio');
const axios = require('axios');

// Requiring package for user authenticaiton
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Require models just like with sequelize
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: process.env.SESSION_SECRET || 'developementSecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT, function () {
  console.log("Server ONLINE ==> 🌎 Listening on port %s. ", PORT);
});
