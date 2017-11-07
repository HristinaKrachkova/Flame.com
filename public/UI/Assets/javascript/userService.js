var userDB = (function() {
    function empty(obj) {
        return obj == null || obj == '' || obj == 'undefined';
    }

    function notEmpty(obj) {
        return empty(obj) == false;
    }

    function _userDB() {
        this.signedUser = null;
    }

    _userDB.prototype.register = function(firstName, lastName, password, email, facebookId, callback) {
        $.ajax({
            url: './api/register',
            method: 'POST',
            data: { firstName: firstName, lastName: lastName, email: email, password: password, fbId: facebookId }
        }).done(function(data) {
            callback(data);
        });
    };

    _userDB.prototype.login = function(email, password, callback) {
        var self = this;

        $.ajax({
            url: './api/login',
            method: 'POST',
            data: { email: email, password: password }
        }).done(function(data) {
            if (data.success == true) {
                self.signedUser = data.user;
            }
            callback(data);
        });
    };

    _userDB.prototype.getUser = function(email, callback) {
        $.ajax({
            url: './api/getUser',
            method: 'POST',
            data: { email: email }
        }).done(function(data) {
            callback(data);
        });
    };

    _userDB.prototype.likeUser = function(id, callback) {
        $.ajax({
            url: './api/like',
            method: 'POST',
            data: { id: id }
        }).done(function(data) {
            callback(data);
        });
    };

    _userDB.prototype.dislikeUser = function(id, callback) {
        $.ajax({
            url: './api/dislike',
            method: 'POST',
            data: { id: id }
        }).done(function(data) {
            callback(data);
        });
    };

    _userDB.prototype.getRandomUser = function(callback) {
        $.ajax({
            url: './api/getRandomUser',
            method: 'POST'
        }).done(function(data) {
            callback(data);
        });
    };

    _userDB.prototype.checkFbUser = function(id, callback) {
        $.ajax({
            url: './api/checkFbUser',
            method: 'POST',
            data: { id: id }
        }).done(function(data) {
            callback(data);
        });
    };

    _userDB.prototype.loginWithFb = function(id, callback) {
        var self = this;

        $.ajax({
            url: './api/loginWithFb',
            method: 'POST',
            data: { id: id }
        }).done(function(data) {
            if (data.success == true) {
                self.signedUser = data.user;
            }
            callback(data);
        });
    };

    _userDB.prototype.updateUserData = function(newEmail, newPass, age, height, gender, moreInfo, callback) {
        var self = this;

        $.ajax({
            url: './api/updateUserData',
            method: 'POST',
            data: { newEmail: newEmail, newPass: newPass, age: age, height: height, gender: gender, moreInfo: moreInfo }
        }).done(function(data) {
            if (data.success == true) {
                // self.signedUser = data.user;
                if (notEmpty(newEmail)) {
                    self.signedUser.email = newEmail;
                }
                if (notEmpty(age)) {
                    self.signedUser.age = parseInt(age);
                }
                if (notEmpty(height)) {
                    self.signedUser.height = parseInt(height);
                }
                if (notEmpty(gender)) {
                    self.signedUser.gender = gender;
                }
                if (notEmpty(moreInfo)) {
                    self.signedUser.moreInfo = moreInfo;
                }
            }
            callback(data);
        });
    };

    _userDB.prototype.updatePreferences = function(searchGender, searchMaxDistance, searchMminAge, searchMmaxAge, callback) {
        var self = this;

        $.ajax({
            url: './api/updatePreferences',
            method: 'POST',
            data: { searchGender: searchGender, searchMaxDistance: searchMaxDistance, searchMminAge: searchMminAge, searchMmaxAge: searchMmaxAge }
        }).done(function(data) {
            // if (data.success == true) {
            //     self.signedUser = data.user;
            // }
            callback(data);
        });
    };

    _userDB.prototype.updateUserImage = function(image, callback) {
        var self = this;

        $.ajax({
            url: './api/updateUserImage',
            method: 'POST',
            data: { image: image }
        }).done(function(data) {
            if (data.success == true) {

            }
            callback(data);
        });
    };

    _userDB.prototype.updateUserLocation = function(longitude, latitude, callback) {
        var self = this;

        $.ajax({
            url: './api/updateUserLocation',
            method: 'POST',
            data: { location: [longitude, latitude] }
        }).done(function(data) {
            callback(data);
        });
    };

    _userDB.prototype.logout = function(callback) {
        var self = this;

        $.ajax({
            url: './api/logout',
            method: 'POST'
        }).done(function(data) {
            self.signedUser = null;
            localStorage.setItem('doNotAutoLogin', true);
            callback(data);
        });
    };

    _userDB.prototype.getMatchedUsers = function(callback) {
        var self = this;

        $.ajax({
            url: './api/getMatchedUsers',
            method: 'POST'
        }).done(function(data) {
            callback(data);
        });
    };

    _userDB.prototype.getPreviousMessages = function(user, callback) {
        var self = this;

        $.ajax({
            url: './api/getPreviousMessages',
            method: 'POST',
            data: { id: user._id }
        }).done(function(data) {
            var msgs = data.messages;

            msgs.forEach(function(msg) {
                msg.time = new Date(msg.time);
                if (msg.sender == self.signedUser._id) {
                    msg.name = self.signedUser.firstName + ' ' + self.signedUser.lastName;
                } else {
                    msg.name = self.chatUser.firstName + ' ' + self.chatUser.lastName;
                }
            });

            callback(msgs);
        });
    };

    return new _userDB();
}());