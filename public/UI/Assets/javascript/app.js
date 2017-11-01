
var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/^", {
        templateUrl : "mainPage.html"
    })
    .when("/login",{
        templateUrl : "emailLogIn.html"
    })
    .when("/user",{
        templateUrl : "userProfile.html"
    })
    .when("/messages",{
        templateUrl : "userMessages.html"
    })
})
.controller('registrationForm', function($scope, $location) {
    $scope.registerAUser = function() {
        var password = $("#password").val();
        var name = $("#name").val();
        var lastName = $("#lastName").val();
        var email = $("#email").val();
        var finder = userDB.users.find(a=>a.email == email);

        if(!finder){
            userDB.addUser(name, lastName, password, email);
            console.log(userDB);
            alert("You are registered now!");
            $location.path('/login');
        }else{
            alert("We already have this user!");
        }
    }
})
.controller('login', function($scope, $location){
    $scope.login = function(){
        event.preventDefault();
        var logInPass = $("#logInPass");
        var logInEmail = $("#logInEmail");
        var finderLog = userDB.users.find(a=>a.email === logInEmail.val());
        if(finderLog){
            if(finderLog.password===logInPass.val()){
                userDB.signedUser = finderLog;
                $("#profileLink").removeClass("disabled");
                $("#findLink").removeClass("disabled");
                $("#messagesLink").removeClass("disabled");
                $location.path('/user');
            }else{
               alert("Wrong password!");
            }
        }else{
            alert("Wrong email");
        }
    }
})
.controller("profile", function($scope){
    $scope.signedUser = userDB.signedUser;
});