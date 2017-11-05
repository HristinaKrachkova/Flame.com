function userData() {
    var user = userDB.signedUser;

    if (user) {
        if (!user.age && !$('#inputAge').length) {
            document.getElementById('ageInput').innerHTML += "<input type='text' id='inputAge' class='changeInput'>";
        } else{
            if (user.age && $('#inputAge').val())
                {document.getElementById("ageInput").removeChild(document.getElementById("inputAge"))};
        }

        if (!user.height && !$('#inputHeight').length) {
            document.getElementById('heightInput').innerHTML += "<input type='text' id='inputHeight' class='changeInput'>";
        }else {
            if (user.height && $('#inputHeight').val())
                {document.getElementById("heightInput").removeChild(document.getElementById("inputHeight"))};
        }

        if (!user.gender && !$('#inputGender').length) {
            document.getElementById('genderInput').innerHTML += "<select id='inputGender' class='changeInput'> <option value=''><option value='мъж'>мъж</option> <option value='жена'>жена</option></select>";
        } else{
            if (user.height && $('#inputGender').val())
                {document.getElementById("genderInput").removeChild(document.getElementById("inputGender"))};
        }
    }
}
userData();
