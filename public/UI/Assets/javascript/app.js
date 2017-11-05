
var app = angular.module('myApp', ['ngRoute']);

function handleLogin(data, $scope, $location) {
    if (data.success == true) {
        $('#profileLink').removeClass('disabled');
        $('#findLink').removeClass('disabled');
        $('#messagesLink').removeClass('disabled');
        $location.path('/user');
        $scope.$apply();
    } else {
        console.log(data);
        alert('Nope!');
    }
}

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'mainPage.html'
        })
        .when('/login', {
            templateUrl: 'emailLogIn.html'
        })
        .when('/user', {
            templateUrl: 'userProfile.html'
        })
        .when('/messages', {
            templateUrl: 'userMessages.html'
        })
        .when('/newpeople', {
            templateUrl: 'newPeople.html'
        });
})
    .controller('registrationForm', function($scope, $location) {
        $scope.registerAUser = function() {
            // event.preventDefault();
            var password = $('#password').val();
            var name = $('#name').val();
            var lastName = $('#lastName').val();
            var email = $('#email').val();

            userDB.register(name, lastName, password, email, '', function(data) {
                if (data.success) {
                    $location.path('/login');

                    $('#notification p').html('&#10003; Успешно се регистрирахте!');
                    $('#notification').css('background-color', '#3399cc').fadeIn('400');
                    setTimeout(function() {
                        $('#notification').fadeOut('400');
                    }, 3000);
                } else {
                    $('#notification p').html('&times; Грешно въведени данни! Моля опитайте отново.');
                    $('#notification').css('background-color', '#e5b85c').fadeIn('400');
                    setTimeout(function() {
                        $('#notification').fadeOut('400');
                    }, 3000);
                    console.log(data.error);

                }
            });
        };
    })
    .controller('login', function($scope, $location) {
        $scope.login = function() {
            event.preventDefault();
            var logInPass = $('#logInPass').val();
            var logInEmail = $('#logInEmail').val();

            userDB.login(logInEmail, logInPass, function(data) {
                handleLogin(data, $scope, $location);
            });
        };
    })
    .controller('profile', function($scope) {
        $scope.signedUser = userDB.signedUser;

        $scope.saveChanges = function () {
            var age = $('#inputAge').val();
            var height = $('#inputHeight').val();
            var gender = $('#inputGender').val();
            var newEmail = $('#userEmailEdit').val();
            var newPass = $('#userPassEdit').val();

            userDB.updateUserData(newEmail, newPass, age, height, gender, function (data) {
                if (data.success == true) {
                    $scope.signedUser = userDB.signedUser;
                    $scope.$apply();
                    userData();
                } else {
                    // error updating user data
                }
            });
        };
    })
    .controller('fbLogin', function($scope, $location) {
        $scope.fbLogin = function() {
            FB.login(function(response) {
                console.log(response);
                if (response.status === 'connected') {
                    userDB.checkFbUser(response.authResponse.userID, function(checkData) {
                        if (checkData.success == true && checkData.exists == true) {
                            userDB.loginWithFb(response.authResponse.userID, function(loginData) {
                                handleLogin(loginData, $scope, $location);
                            });
                        } else {
                            FB.api('/me', { fields: 'first_name, last_name, email' }, function(meResponse) {
                                // I think this password is secure!
                                userDB.register(meResponse.first_name, meResponse.last_name, '', meResponse.email, response.authResponse.userID, function(data) {
                                    if (data.success) {
                                        userDB.loginWithFb(response.authResponse.userID, function(loginData) {
                                            handleLogin(loginData, $scope, $location);
                                        });
                                    } else {
                                        console.log(data.error);
                                        alert('There was a problem with your registration');
                                    }
                                });
                            });
                        }
                    });
                } else {
                    alert('Mi ni staa!');
                }
            }, { scope: 'public_profile, email' });
        };

        window.fbAsyncInit = function() {
            FB.init({
                appId: '132563934170714',
                cookie: true, // enable cookies to allow the server to access
                // the session
                xfbml: true, // parse social plugins on this page
                version: 'v2.8' // use graph api version 2.8
            });

            FB.getLoginStatus(function(response) {
                if (response.status == 'connected') {
                    userDB.loginWithFb(response.authResponse.userID, function(loginData) {
                        handleLogin(loginData, $scope, $location);
                    });
                }
            });
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];

            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    })
    .controller('newpeople', function($scope) {
        // Stores the latest random user;
        var newPerson = null;

        // Loads and displays a random person;
        function getRandomUser() {
            userDB.getRandomUser(function(data) {
                if (data.success == true) {
                    newPerson = data.user;
                    $scope.newPerson = data.user;
                    $scope.$apply();
                }
            });
        }
        getRandomUser();
        // Function for Like and check if you are a match and show the next random user;
        $scope.likeUser = function() {
            userDB.likeUser(newPerson._id, function(data) {
                if (data.success == true && data.isMatch == true) {
                    alert('Match!');
                }
                getRandomUser();
            });
        };
        // Function for Dislike and show the next random user;
        $scope.dislikeUser = function() {
            userDB.dislikeUser(newPerson._id, function(data) {
                getRandomUser();
            });
        };
    });
