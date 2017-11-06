var messages = (function() {
    function _message(senderName, receiverName, newMessage) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.newMessage = newMessage;
    }

    _message.prototype.addNewMessage = function() {
        $.ajax({
            url: './api/newMessage',
            method: 'POST',
            data: { senderName: this.senderName, receiverName: this.receiverName, newMessage: this.newMessage }
        }).done(function(data) {
            callback(data);
        });
    }

    return new _message();
}());