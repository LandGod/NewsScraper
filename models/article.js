const mongoose = require("mongoose");
const Comment = require("./comment");

// Aliase schema constructor
const Schema = mongoose.Schema;

// Create new schema for articles using schema constructor
// Similar to Sequelize, but not exactly the same, of course
var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    url: {
        type: String,
        required: true,
        unique: true
    }, 
    byline: {
        type: String,
        default: 'AP Staff'
    },
    publishDate: {
        type: Date,
        required: true
    },
    location: {
        type: String
    },
    children: [Comment.schema]
});

// Create model from schema
const Article = mongoose.model('Article', ArticleSchema);

// Export model
module.exports = Article; 