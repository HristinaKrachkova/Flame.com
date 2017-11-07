var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable

// Message Mongoose Schema
var MessageSchema = new Schema({
    sender: { type: "ObjectId", required: true },
    receiver: { type: "ObjectId", required: true },
    message: { type: String, required: true },
    time: { type: Date, required: true }
});

module.exports = mongoose.model('Message', MessageSchema); // Export Messages Model for us in API