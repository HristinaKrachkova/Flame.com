$("#profileImageInput").change(function(){
    userDB.signedUser.profileImage = $(this).val();
})