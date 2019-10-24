const mongoose = require("mongoose");

// Aliase schema constructor
const Schema = mongoose.Schema;

// Create new schema for comments using schema constructor
// Similar to Sequelize, but not exactly the same, of course
var CommentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    postDate: {
        type: Date,
        required: true
    }
});

// Create model from schema
const Comment = mongoose.model('Comment', CommentSchema);

// Export model
module.exports = Comment; 