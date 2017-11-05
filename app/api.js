﻿var User = require('./models/user.js'); // Import User Model
var mongoose = require('mongoose'); // HTTP request logger middleware for Node.js

module.exports = function(router) {
    function getUserById(id, callback) {
        User.findOne({ _id: id }).exec(function(err, user) {
            callback(err, user);
        });
    }

    function getUserByEmail(email, callback) {
        User.findOne({ email: email }).exec(function(err, user) {
            callback(err, user);
        });
    }

    function getUserByFbId(id, callback) {
        User.findOne({ facebookId: id }).exec(function(err, user) {
            callback(err, user);
        });
    }

    // Function that processes like/dislike input and handles common errors
    function handleLikeDislike(req, res, callback) {
        // Get the id of the liked/disliked user
        var id = req.body.id;

        // Check if logged in
        if (!req.currentUser) {
            res.json({ success: false, message: 'You are not logged in.' });

            return;
        }

        // Check if liked/disliked has already been selected by this pair of users
        var isLiked = req.currentUser.likes.indexOf(id) > -1;
        var isDisliked = req.currentUser.dislikes.indexOf(id) > -1;

        if (isLiked || isDisliked) {
            res.json({ success: false, message: 'You have already liked/disliked this person.' });

            return;
        }

        // Get the liked/disliked user from the database
        getUserById(id, function(err, user) {
            if (user) {
                // If the user exists pass it to the function that handles the real thing
                callback(user);
            } else {
                res.json({ success: false, message: 'This person does not exist.' });
            }
        });
    }

    router.post('/register', function(req, res) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var password = req.body.password;
        var email = req.body.email;
        var fbId = req.body.fbId;

        var user = new User();

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        if (fbId == null) {
            fbId = null;
            user.setPassword(password);
        }
        user.likes = [];
        user.dislikes = [];
        user.matches = [];
        user.facebookId = fbId;

        user.save(function(err) {
            if (err) {
                res.json({ success: false, error: err });
            } else {
                res.json({ success: true, result: req.body.username });
            }
        });
    });

    router.post('/login', function(req, res) {
        var email = req.body.email;
        var password = req.body.password;

        getUserByEmail(email, function(err, user) {
            if (user) {
                if (user.facebookId === null) {
                    if (user.comparePassword(password)) {
                        req.session.userId = user._id;
                        res.json({ success: true, user: user });

                        return;
                    }
                }
            }
            res.json({ success: false, message: 'Something went wrong.' });
        });
    });

    router.post('/getUserById', function(req, res) {
        var id = req.body.userId;

        getUserById(id, function(err, user) {
            if (user) {
                res.json({ success: true, user: user });
            } else {
                res.json({ success: false, message: 'Something went wrong.' });
            }
        });
    });

    router.post('/getUserByEmail', function(req, res) {
        var email = req.body.email;

        getUserByEmail(email, function(err, user) {
            if (user) {
                res.json({ success: true, user: user });
            } else {
                res.json({ success: false, message: 'Something went wrong.' });
            }
        });
    });

    router.post('/like', function(req, res) {
        handleLikeDislike(req, res, function(user) {
            // Push the new like
            req.currentUser.likes.push(user._id);

            var isMatch = false;

            // Check if it's a match and add the users to their matches lists
            if (user.likes.indexOf(req.currentUser._id) > -1) {
                isMatch = true;

                req.currentUser.matches.push(user._id);

                user.matches.push(req.currentUser._id);
                user.save();
            }

            // Save the user to the database
            req.currentUser.save(function(err) {
                console.log(err);
                res.json({ success: true, isMatch: isMatch });
            });
        });
    });

    router.post('/dislike', function(req, res) {
        handleLikeDislike(req, res, function(user) {
            // Push the new dislike
            req.currentUser.dislikes.push(user._id);

            // Save the user to the database
            req.currentUser.save(function(err) {
                console.log(err);
                res.json({ success: true });
            });
        });
    });

    router.post('/getRandomUser', function(req, res) {
        // Check if logged in
        if (!req.currentUser) {
            res.json({ success: false, message: 'You are not logged in.' });

            return;
        }

        // Select a random person from the database, that has not already been liked/disliked
        User.aggregate(
            [{
                $match: {
                    '$and': [{
                        '_id': { '$nin': req.currentUser.likes }
                    },
                    {
                        '_id': { '$nin': req.currentUser.dislikes }
                    },
                    {
                        '_id': { '$ne': req.currentUser._id }
                    }
                    ]
                }
            },
            {
                $sample: {
                    size: 1
                }
            },
            {
                $project: {
                    'firstName': true,
                    'lastName': true,
                    'age': true,
                    'height': true,
                    'gender': true,
                    'image': true
                }
            }
            ], function(err, users) {
                if (err) {
                    console.log(err);
                    res.json({ success: false, message: 'Something went wrong.' });
                } else {
                    console.log(users);
                    res.json({ success: true, user: users[0] });
                }
            }
        );
    });

    router.post('/checkFbUser', function(req, res) {
        var id = req.body.id;

        console.log(id);
        getUserByFbId(id, function(err, user) {
            if (user) {
                res.json({ success: true, exists: true });
            } else {
                res.json({ success: true, exists: false });
            }
        });
    });

    // This is unsecure, but we'll improve it later
    router.post('/loginWithFB', function(req, res) {
        var id = req.body.id;

        getUserByFbId(id, function(err, user) {
            if (user) {
                req.session.userId = user._id;
                res.json({ success: true, user: user });

                return;
            }
            res.json({ success: false, message: 'Something went wrong.' });
        });
    });

    // This is unsecure, but we'll improve it later
    router.post('/updateUserData', function(req, res) {
        var newEmail = req.body.newEmail;
        var newPass = req.body.newPass;
        var age = req.body.age;
        var height = req.body.height;
        var gender = req.body.gender;

        console.log(req.body);

        if (req.currentUser.facebookId === null && newPass != null) {
            req.currentUser.setPassword(newPass);
        }
        if (newEmail != null) {
            req.currentUser.email = newEmail;
        }
        if (age != null) {
            req.currentUser.age = age;
        }
        if (height != null) {
            req.currentUser.height = height;
        }
        if (gender != null) {
            req.currentUser.gender = gender;
        }
        req.currentUser.save(function (err) {
            if (err) {
                res.json({ success: false, error: err });
            } else {
                res.json({ success: true, user: req.currentUser });
            }
        });
    });

    return router;
};