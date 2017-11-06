var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable

// Message Mongoose Schema
var MessageSchema = new Schema({
    senderId: { type: ObjectId, required: true },
    receiverId: { type: ObjectId, required: true },
    newMessage: { type: newMessage, required: true },
});


module.exports = mongoose.model('Message', MessageSchema); // Export Messages Model for us in API