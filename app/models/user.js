var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin

// User Name Validator
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+)+$/,
        message: 'Name must be at least 3 characters, max 30, no special characters or numbers.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// User E-mail Validator
var emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
        message: 'Name must be at least 3 characters, max 40, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// Username Validator
var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only'
    })
];

// Password Validator
var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// User Mongoose Schema
var UserSchema = new Schema({
    firstName: { type: String, required: true, validate: nameValidator },
    lastName: { type: String, required: true, validate: nameValidator },
    password: { type: String, required: false },
    email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
    age: { type: Number, required: false },
    gender: { type: String, required: false },
    height: { type: Number, required: false },
    location: { type: [Number], index: '2d' },
    active: { type: Boolean, required: true, default: false },
    likes: { type: Array, required: false, default: [] },
    dislikes: { type: Array, required: false, default: [] },
    matches: { type: Array, required: false, default: [] },
    facebookId: { type: String, required: false },
    profileImage: { type: String, required: false },

    facebookUrl: { type: String, required: false, default: 'http://www.facebook.com' },
    photos: { type: Array, required: false, default: [] },
    messages: { type: Array, required: false, default: [] },
    preferences: { type: Object, required: false }

});

// Middleware to ensure password is encrypted before saving user to database
// UserSchema.pre('save', function(next) {
//    var user = this;

//    if (!user.isModified('password')) return next(); // If password was not changed or is new, ignore middleware

//    // Function to encrypt password 
//    bcrypt.hash(user.password, null, null, function(err, hash) {
//        if (err) return next(err); // Exit if error is found
//        user.password = hash; // Assign the hash to the user's password so it is saved in database encrypted
//        next(); // Exit Bcrypt function
//    });
// });

// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
UserSchema.plugin(titlize, {
    paths: ['name']
});

// Method to compare passwords in API (when user logs in) 
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); // Returns true if password matches, false if doesn't
};

// Method to compare passwords in API (when user logs in) 
UserSchema.methods.setPassword = function(password) {
    this.password = bcrypt.hashSync(password);
};

module.exports = mongoose.model('User', UserSchema); // Export User Model for us in API
