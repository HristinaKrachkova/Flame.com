$(".hint").hide();

var password = $("#password");
var password2 = $("#confirmPassword");
var button = $("#submitRegisterForm")
button.prop("disabled", true);

$("form input").keyup(function () {
    if ($(this).val().slice(-1) == " ") {
        $(this).val($(this).val().slice(0, $(this).val().length - 1));
    }
})

password.keyup(function () {
    if (password.val().length < 8) {
        password.next().fadeIn("400");
        button.prop("disabled", true);
    } else {
        password.next().hide("slow");
        if($("#username").val().length >0) button.prop("disabled", false);
    }
}).focusout(function () {
    if (password.val() != password2.val()) {
        $("#confirmPassword").next().fadeIn("400");
        button.prop("disabled", true);
    }
})

password2.keyup(function(){
    if (password.val() != password2.val()) {
        $("#confirmPassword").next().fadeIn("400");
        button.prop("disabled", true);
    }else{
        $("#confirmPassword").next().hide("slow");
        if($("#username").val().length >0) button.prop("disabled", false);
    }
})

$("#username").keyup(function(){
    $("#username").next().fadeIn("400");
}).focusout(function(){
    if($("#username").val().length >0){
        $("#username").next().hide("slow");
        if(password.val() == password2.val() && password.val().length>8){
            button.prop("disabled", false);
        }
    }else{
        button.prop("disabled", true);
    }
})
