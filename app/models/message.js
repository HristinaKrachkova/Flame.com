var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable

// Message Mongoose Schema
var MessageSchema = new Schema({
    senderName: { type: String, required: true },
    receiverName: { type: String, required: true },
    newMessage: { type: String, required: true }
});


module.exports = mongoose.model('Message', MessageSchema); // Export Messages Model for us in API