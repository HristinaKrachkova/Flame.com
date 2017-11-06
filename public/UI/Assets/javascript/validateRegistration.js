$('.hint').hide();

var password = $('#password');
var password2 = $('#confirmPassword');
var button = $('#submitRegisterForm');

button.prop('disabled', true);
var inputValidation = $('#name').val().length > 0 &&
$('#lastName').val().length > 0 &&
password2.val === password.val &&
password.val.length >= 8 &&
$('#email').val.length > 0;

$('form input').keyup(function () {
    if ($(this).val().slice(-1) === ' ') {
        $(this).val($(this).val().slice(0, $(this).val().length - 1));
    }
});

password.keyup(function () {
    if (password.val().length < 8) {
        password.next().fadeIn('400');
        button.prop('disabled', true);
    } else {
        var inputValidation = $('#name').val().length > 0 &&
        $('#lastName').val().length > 0 &&
        password2.val === password.val &&
        password.val.length > 0 &&
        $('#email').val.length > 0;

        password.next().hide('slow');
        if (inputValidation) button.prop('disabled', false);
    }
}).focusout(function () {
    if (password.val() != password2.val()) {
        $('#confirmPassword').next().fadeIn('400');
        button.prop('disabled', true);
    }
});

password2.keyup(function() {
    if (password.val() != password2.val()) {
        $('#confirmPassword').next().fadeIn('400');
        button.prop('disabled', true);
    } else {
        var inputValidation = $('#name').val().length > 0 &&
        $('#lastName').val().length > 0 &&
        password2.val === password.val &&
        password.val.length > 0 &&
        $('#email').val.length > 0;

        $('#confirmPassword').next().hide('slow');
        if (inputValidation) button.prop('disabled', false);
    }
});

$('#email').focusout(function() {
    var inputValidation = $('#name').val().length > 0 &&
    $('#lastName').val().length > 0 &&
    password2.val === password.val &&
    password.val.length > 0 &&
    $('#email').val.length > 0;

    if (inputValidation) button.prop('disabled', false);
});
