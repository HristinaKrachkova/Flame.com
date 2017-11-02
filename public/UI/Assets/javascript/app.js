
var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "mainPage.html"
    })
    .when("/login",{
        templateUrl : "emailLogIn.html"
    })
    .when("/user",{
        templateUrl : "userProfile.html",
    })
    .when("/messages",{
        templateUrl : "userMessages.html"
    })
})
.controller('registrationForm', function($scope, $location) {
    $scope.registerAUser = function () {
        event.preventDefault();
        var password = $("#password").val();
        var name = $("#name").val();
        var lastName = $("#lastName").val();
        var email = $("#email").val();

        userDB.register(name, lastName, password, email, function (data) {
            if (data.success) {
                alert("You are registered now!");
            } else {
                console.log(data.error);
                alert("There was a problem with your registration");
            }
        });
    }
})
.controller('login', function($scope, $location){
    $scope.login = function(){
        event.preventDefault();
        var logInPass = $("#logInPass").val();
        var logInEmail = $("#logInEmail").val();
        
        userDB.login(logInEmail, logInPass, function (data) {
            if (data.success == true) {
                $("#profileLink").removeClass("disabled");
                $("#findLink").removeClass("disabled");
                $("#messagesLink").removeClass("disabled");
                $location.path('/user');
                $scope.$apply();
            } else {
                console.log(data);
                alert("Nope!");
            }
        });
    }
})
.controller("profile", function($scope){
    $scope.signedUser = userDB.signedUser;
    $scope.saveChanges = function(){
        userDB.signedUser.setUserAge($("#input1").val());
        userData();
        
    }
});