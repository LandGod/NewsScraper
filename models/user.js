const mongoose = require("mongoose");

// Aliase schema constructor
const Schema = mongoose.Schema;

// Create new schema for users using schema constructor
// Similar to Sequelize, but not exactly the same, of course
var UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    privledges: {
        type: Number,
        default: 1
    },
    email: {
        type: String,
        required: true
    }
});

// Create model from schema
const User = mongoose.model('User', UserSchema);

// Export model
module.exports = User; 