var User = require('./models/user.js'); // Import User Model

module.exports = function (router) {
    router.post('/register', function (req, res) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var password = req.body.password;
        var email = req.body.email;

        var user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = password;
        user.save(function (err) {
            if (err) {
                res.json({ success: false, error: err });
            } else {
                res.json({ success: true, result: req.body.username });
            }
        });
    });

    router.post('/login', function (req, res) {
        var email = req.body.email;
        var password = req.body.password;

        User.findOne({ email: email }).exec(function (err, user) {
            if (user) {
                if (user.comparePassword(password)) {
                    res.json({ success: true, user: user });
                    return;
                }
            }
            res.json({ success: false, message: 'Something went wrong.' });
        });
    });

    router.post('/getUser', function (req, res) {
        var email = req.body.email;

        User.findOne({ email: email }).exec(function (err, user) {
            if (user) {
                res.json({ success: true, user: user });
            } else {
                res.json({ success: false, message: 'Something went wrong.' });
            }
        });
    });

    return router;
}