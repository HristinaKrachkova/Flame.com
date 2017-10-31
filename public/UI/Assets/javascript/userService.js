var userDB = (function(){
    function _userDB(){
        if(localStorage.getItem('users')!==null){
            this.users=JSON.parse(localStorage.getItem('users'));
        }else{
            this.users=[];
            localStorage.setItem('users',JSON.stringify(this.users));
        }
        this.signedUser = null;
    }
    
    function _user(password, email, firstName, lastName){
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.email=email;

        this.photos = [];
        this.likedPersons = [];
        this.messages  = [];

        this.age;
        this.gender;
        this.height;
        this.weight;
        this.facebookURL;

        this.preferences = {
            diameter :0,
            minAge:18,
            maxAge:99,
            gender: "",
            showMe:true
        }
        this.location = null;
    }

    _user.prototype.changePassword = function(newPassword){
        if(this.password!= newPassword && newPassword.length>=8){
            this.password = newPassword;
        }
    }

    _user.prototype.changeEmail = function(newEmail){
        if(this.email!=newEmail && newEmail.trim()!=""){
            this.email = newEmail;
        }
    }
    _user.prototype.modifyPreferences = function(diameter, minAge, maxAge, gender, showMe){
        this.preferences.diameter = diameter;
        this.preferences.minAge = minAge;
        this.preferences.maxAge = maxAge;
        this.preferences.gender = gender;
        this.preferences.showMe = showMe;
    }

    _user.prototype.setUserAge = function(age){
        if(age>=18 && age <100 && this.age == undefined){
            this.age = age;
        }
    }

    _user.prototype.setUserGender = function(gender){
        if(this.gender == undefined)
            this.gender = gender;
    }

    _user.prototype.setUserHeight = function(height){
        if(height>50)
            this.height = height;
    }

    _user.prototype.setUserWeight = function(weight){
        if(weight>30 && weight<250)
            this.weight = weight;
    }   

    _userDB.prototype.addUser = function(firstName, lastName, password, email){
        this.users.push(new _user(password, email, firstName, lastName));
        localStorage.setItem('users',JSON.stringify(this.users));
    }
    return new _userDB();
}())