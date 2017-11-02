function userData(){
    var user = userDB.signedUser;
    if(user){
        if(!user.age){
            document.getElementById("ageInput").innerHTML += "<input type='text' id='input1'>";
        }else{
            document.getElementById("ageInput").removeChild(document.getElementById("input1"))
        }
    }
}
userData();