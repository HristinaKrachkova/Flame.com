var userDB = (function() {
    function _userDB() {
        this.signedUser = null;
    }

    function _user(password, email, firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.email = email;

        this.profileImage = '';
        this.photos = ['https://ichef-1.bbci.co.uk/news/660/cpsprodpb/180CD/production/_97090589_gettyimages-814600274.jpg'];
        this.likedPersons = [];
        this.messages = [];

        this.age = '';
        this.gender = '';
        this.height;
        this.weight;
        this.facebookURL;

        this.preferences = {
            diameter: 0,
            minAge: 18,
            maxAge: 99,
            gender: '',
            showMe: true
        };
        this.location = null;
    }

    _user.prototype.changePassword = function(newPassword) {
        if (this.password != newPassword && newPassword.length >= 8) {
            this.password = newPassword;
        }
    };

    _user.prototype.changeEmail = function(newEmail) {
        if (this.email != newEmail && newEmail.trim() != '') {
            this.email = newEmail;
        }
    };
    _user.prototype.modifyPreferences = function(diameter, minAge, maxAge, gender, showMe) {
        this.preferences.diameter = diameter;
        this.preferences.minAge = minAge;
        this.preferences.maxAge = maxAge;
        this.preferences.gender = gender;
        this.preferences.showMe = showMe;
    };

    _user.prototype.setUserAge = function(age) {
        if (age >= 18 && age < 100 && this.age == undefined) {
            this.age = age;
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    };

    _user.prototype.setUserGender = function(gender) {
        if (this.gender == undefined) { this.gender = gender; }
    };

    _user.prototype.setUserHeight = function(height) {
        if (height > 50) { this.height = height; }
    };

    _user.prototype.setUserWeight = function(weight) {
        if (weight > 30 && weight < 250) { this.weight = weight; }
    };

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

    _userDB.prototype.updateUserData = function(newEmail, newPass, age, height, gender, callback) {
        var self = this;

        $.ajax({
            url: './api/updateUserData',
            method: 'POST',
            data: { newEmail: newEmail, newPass: newPass, age: age, height: height, gender: gender }
        }).done(function(data) {
            if (data.success == true) {
                self.signedUser = data.user;
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


    return new _userDB();
}());