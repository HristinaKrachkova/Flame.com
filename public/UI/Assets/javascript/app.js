
var app = angular.module('myApp', ['ngRoute']);

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
        $scope.registerAUser = function () {
            event.preventDefault();
            var password = $('#password').val();
            var name = $('#name').val();
            var lastName = $('#lastName').val();
            var email = $('#email').val();
            userDB.register(name, lastName, password, email, function (data) {
                if (data.success) {
                    $location.path('/login')
                    alert('You are registered now!');
                } else {
                    console.log(data.error);
                    alert('There was a problem with your registration');
                }
            });
        };
    })
    .controller('login', function($scope, $location) {
        $scope.login = function() {
            event.preventDefault();
            var logInPass = $('#logInPass').val();
            var logInEmail = $('#logInEmail').val();

            userDB.login(logInEmail, logInPass, function (data) {
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
            });
        };
    })
    .controller('profile', function($scope) {
        $scope.signedUser = userDB.signedUser;
        $scope.saveChanges = function() {
            if($('#inputAge').val())
                userDB.signedUser.age = $('#inputAge').val();
            if($('#inputHeight').val())
                userDB.signedUser.height = $('#inputHeight').val();
            if($('#inputGender').val())
                userDB.signedUser.gender = $('#inputGender').val();
            $scope.signedUser = userDB.signedUser;
            userData();
        };
    })
    .controller('newpeople', function ($scope) {
        // Stores the latest random user;
        var newPerson = null;

        // Loads and displays a random person;
        function getRandomUser() {
            userDB.getRandomUser(function (data) {
                if (data.success == true) {
                    newPerson = data.user;
                    $scope.newPerson = data.user;
                    $scope.$apply();
                }
            });
        }
        getRandomUser();
        // Function for Like and check if you are a match and show the next random user;
        $scope.likeUser = function () {
            userDB.likeUser(newPerson._id, function (data) {
                if (data.success == true && data.isMatch == true) {
                    alert('Match!');
                }
                getRandomUser();
            });
        };
        // Function for Dislike and show the next random user;
        $scope.dislikeUser = function () {
            userDB.dislikeUser(newPerson._id, function (data) {
                getRandomUser();
            });
        };
    });
