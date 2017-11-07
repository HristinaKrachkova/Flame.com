var app = angular.module('myApp', ['ngRoute']);

function handleLogin(data, $scope, $location) {
    if (data.success == true) {
        localStorage.removeItem('doNotAutoLogin');
        updateUserLocation();
        $('#profileLink').removeClass('disabled');
        $('#findLink').removeClass('disabled');
        $('#messagesLink').removeClass('disabled');
        $location.path('/user');
        $scope.$apply();
    } else {
        $('#notification p').html('&times; Грешно въведени данни! Моля опитайте отново.');
        $('#notification').css('background-color', '#e5b85c').fadeIn('400');
        setTimeout(function() {
            $('#notification').fadeOut('400');
        }, 3000);
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
            })
            .when('/aboutUs', {
                templateUrl: 'aboutUs.html'
            })
            .when('/contacts', {
                templateUrl: 'contacts.html'
            });
    })
    .factory('socket', function($rootScope) {
        var socket = io.connect('http://127.0.0.1:4000');

        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;

                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;

                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    })
    .controller('blackBackground', function($scope) {
        $scope.hideBackground = function() {
            $('#blackBackground').fadeOut('400');
            $('.container').fadeOut('400');
            $('body').css('overflow', 'visible');
        };
    })
    .controller('messages', function($scope, $timeout, socket) {
        $scope.currentUser = userDB.signedUser;
        $scope.messages = [];

        socket.emit('identify', {
            id: userDB.signedUser._id
        });

        // Set default status
        var statusDefault = '';
        var setStatus = function(s) {
            // Set status
            $scope.status = s;
            if (s !== statusDefault) {
                var delay = $timeout(function() {
                    setStatus(statusDefault);
                }, 2000);
            }
        };

        socket.on('output', function(data) {
            data.forEach(function(msg) {
                msg.time = new Date(msg.time);
            });
            $scope.messages = $scope.messages.concat(data);
        });
        // Get Status From Server
        socket.on('status', function(data) {
            // get message status
            setStatus((typeof data === 'object') ? data.message : data);
            // If status is clear, clear text
            if (data.clear) {
                $scope.newMessage = '';
            }
        });

        $scope.sendMessage = function(event) {
            if (event.keyCode === 13) {
                if ($('#textarea').val().length > 0) {
                    var message = {
                        sender: userDB.signedUser._id,
                        receiver: userDB.chatUser._id,
                        message: textarea.value,
                        time: new Date()
                    };

                    socket.emit('input', message);
                    message.name = userDB.signedUser.firstName + ' ' + userDB.signedUser.lastName;
                    $scope.messages = $scope.messages.concat([message]);
                    textarea.value = '';
                }
            }
        };

        // Handle Chat Clear
        $scope.clearMessages = function() {
            socket.emit('clear');
        };

        // Clear Message
        socket.on('cleared', function() {
            messages.textContent = '';
        });

        userDB.getMatchedUsers(function(data) {
            if (data.success === true) {
                $scope.matches = data.users;
                $scope.$apply();
            }
        });

        $scope.chatWith = function(user) {
            userDB.chatUser = user;
            $scope.location = user.location;
            $scope.messages = [];
            $('.container').fadeIn('400');
            $('#blackBackground').fadeIn('400');
            $('body').css('overflow', 'hidden');
            userDB.getPreviousMessages(user, function(messages) {
                $scope.messages = messages;
                $scope.$apply();
            });
        };
    })
    .controller('registrationForm', function($scope, $location) {
        $scope.registerAUser = function() {
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
    .controller('menu', function($scope, $location) {
        $scope.messages = function() {
            $location.path('/messages');
        };
        $scope.find = function() {
            $location.path('/newpeople');
        };
        $scope.user = function() {
            $location.path('/user');
        };
        $scope.aboutUs = function() {
            $location.path('/aboutUs');
        };
        $scope.contacts = function() {
            $location.path('/contacts');
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
    .controller('profile', function($scope, $location) {
        $scope.selectedImages = null;
        $scope.signedUser = userDB.signedUser;
        $scope.logout = function() {
            if (userDB.signedUser.facebookId != null) {
                FB.logout();
            }
            userDB.logout(function() {
                $location.path('/');
                $scope.$apply();
                $('#profileLink').addClass('disabled');
                $('#findLink').addClass('disabled');
                $('#messagesLink').addClass('disabled');
            });
        };
        $scope.saveChanges = function() {
            var age = $('#inputAge').val();
            var height = $('#inputHeight').val();
            var gender = $('#inputGender').val();
            var newEmail = $('#userEmailEdit').val();
            var newPass = $('#userPassEdit').val();
            var newInfo = $('#moreInfo').val();

            userDB.updateUserData(newEmail, newPass, age, height, gender, newInfo, function(data) {
                if (data.success == true) {
                    $scope.signedUser = userDB.signedUser;
                    $scope.$apply();
                } else {
                    console.log(data.error);
                    // error updating user data
                }
            });
            $('#notification p').html('&#10003; Промените са запазени!');
            $('#notification').css('background-color', '#3399cc').fadeIn('400');
            setTimeout(function() {
                $('#notification').fadeOut('400');
            }, 3000);
        };

        $scope.savePreferences = function() {
            if ($('#genderPrefMale').prop('checked') == true) {
                var searchGender = $('#genderPrefMale').val();
            } else {
                if ($('#genderPrefFemale').prop('checked') == true) {
                    var searchGender = $('#genderPrefFemale').val();
                }
            }

            var searchMaxDistance = $('#currentval').val();

            $('#rangeval').html().charAt(0);
            var searchMminAge = $('#rangeval').html().charAt(0) + $('#rangeval').html().charAt(1);
            var searchMmaxAge = $('#rangeval').html().charAt(5) + $('#rangeval').html().charAt(6);

            userDB.updatePreferences(searchGender, searchMaxDistance, searchMminAge, searchMmaxAge, function(data) {
                if (data.success == true) {
                    $scope.signedUser = userDB.signedUser;
                    $scope.$apply();
                } else {
                    console.log(data.error);
                    // error updating user data
                }
            });
            $('#notification p').html('&#10003; Промените са запазени!');
            $('#notification').css('background-color', '#3399cc').fadeIn('400');
            setTimeout(function() {
                $('#notification').fadeOut('400');
            }, 3000);
        };

        $('#profileImageInput').change(function() {
            var file = $('#profileImageInput').prop('files')[0];

            if (file != null) {
                var reader = new FileReader();

                reader.readAsDataURL(file);
                reader.onload = function() {
                    // var imageWithType = "data:image; base64, ";

                    userDB.updateUserImage(reader.result, function(data) {
                        if (data.success == true) {
                            var thumbnail = $('#userPhoto');

                            thumbnail.attr('src', reader.result);
                        } else {
                            alert('Error uploading image.');
                        }
                    });
                };
                reader.onerror = function(error) {
                    console.log('Error: ', error);
                };
            }
        });
    })
    .controller('fbLogin', function($scope, $location) {
        $scope.fbLogin = function() {
            FB.login(function(response) {
                console.log(response);
                if (response.status === 'connected') {
                    var fbId = response.authResponse.userID;

                    userDB.checkFbUser(fbId, function(checkData) {
                        if (checkData.success == true && checkData.exists == true) {
                            userDB.loginWithFb(fbId, function(loginData) {
                                handleLogin(loginData, $scope, $location);
                            });
                        } else {
                            FB.api('/me', { fields: 'first_name, last_name, email' }, function(meResponse) {
                                // I think this password is secure!
                                userDB.register(meResponse.first_name, meResponse.last_name, '', meResponse.email, fbId, function(data) {
                                    if (data.success) {
                                        userDB.loginWithFb(fbId, function(loginData) {
                                            handleLogin(loginData, $scope, $location);

                                            FB.api(
                                                '/' + fbId + '/picture?type=square&width=300&height=300',
                                                function(picResponse) {
                                                    if (picResponse && !picResponse.error) {
                                                        var url = picResponse.data.url;
                                                        var xhr = new XMLHttpRequest();

                                                        xhr.onload = function() {
                                                            var reader = new FileReader();

                                                            reader.onloadend = function() {
                                                                userDB.updateUserImage(reader.result, function(data) {
                                                                    if (data.success == true) {
                                                                        var thumbnail = $('#userPhoto');

                                                                        thumbnail.attr('src', reader.result);
                                                                    } else {
                                                                        alert('Error uploading image.');
                                                                    }
                                                                });
                                                            };
                                                            reader.readAsDataURL(xhr.response);
                                                        };
                                                        xhr.open('GET', url);
                                                        xhr.responseType = 'blob';
                                                        xhr.send();
                                                    }
                                                }
                                            );
                                        });
                                    } else {
                                        $('#notification p').html('&times; Грешно въведени данни. Моля, опитайте отново!');
                                        $('#notification').css('background-color', '#e5b85c').fadeIn('400');
                                        setTimeout(function() {
                                            $('#notification').fadeOut('400');
                                        }, 3000);
                                    }
                                });
                            });
                        }
                    });
                } else {
                    $('#notification p').html('&times; Възникна грешка!');
                    $('#notification').css('background-color', '#e5b85c').fadeIn('400');
                    setTimeout(function() {
                        $('#notification').fadeOut('400');
                    }, 3000);
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

            if (!localStorage.getItem('doNotAutoLogin')) {
                FB.getLoginStatus(function(response) {
                    if (response.status == 'connected') {
                        userDB.loginWithFb(response.authResponse.userID, function(loginData) {
                            handleLogin(loginData, $scope, $location);
                        });
                    }
                });
            }
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];

            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
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
                    $('#notification p').html('&#10003; Имате съвпадение!');
                    $('#notification').css('background-color', '#3399cc').fadeIn('400');
                    setTimeout(function() {
                        $('#notification').fadeOut('400');
                    }, 3000);
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
        $scope.nextUser = function() {
            getRandomUser();
        };
    });

function updateUserLocation() {
    if (userDB.signedUser) {
        navigator.geolocation.getCurrentPosition(function(location) {
            userDB.updateUserLocation(location.coords.latitude, location.coords.longitude, function(data) {
                setTimeout(updateUserLocation, 60000);
            });
        });
    }
}