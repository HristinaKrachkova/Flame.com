var messages = (function() {
    function _message(senderId, receiverId, newMessage) {
        this.senderId = sendUsenderIdserId;
        this.receiverId = receiverId;
        this.newMessage = newMessage;
    }

    _message.prototype.addNewMessage = function(newMessage) {
        $.ajax({
            url: './api/newMessage',
            method: 'POST',
            data: { senderId: senderId, receiverId: receiverId, newMessage: newMessage }
        }).done(function(data) {
            callback(data);
        });
    }

    return new _message();
}());