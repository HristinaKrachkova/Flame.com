var express = require('express'); // ExperssJS Framework
var session = require('express-session');
var app = express(); // Invoke express to variable for use in application
var port = process.env.PORT || 8080; // Set default port or assign a port in enviornment
var morgan = require('morgan'); // Import Morgan Package
var mongoose = require('mongoose'); // HTTP request logger middleware for Node.js
var bodyParser = require('body-parser'); // Node.js body parsing middleware. Parses incoming request bodies in a middleware before your handlers, available under req.body.
var router = express.Router(); // Invoke the Express Router
var appRoutes = require('./app/api.js')(router); // Import the application end points/API
var path = require('path'); // Import path module
var passport = require('passport'); // Express-compatible authentication middleware for Node.js.
var User = require('./app/models/user.js');
// var social = require('./app/passport/passport')(app, passport); // Import passport.js End Points/API

// Use express session
app.use(session({
    secret: 'trolly-lolly',
    resave: false,
    saveUninitialized: true
}));

// Load the logged in user into the request variable (if logged in)
app.use(function(req, res, next) {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }).exec(function(err, user) {
            if (user) {
                req.currentUser = user;
            } else {
                delete req.session.userId;
            }
            next();
        });
    } else {
        next();
    }
});

app.use(morgan('dev')); // Morgan Middleware
app.use(bodyParser.json()); // Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public/UI')); // Allow front end to access public folder
app.use('/api', appRoutes); // Assign name to end points (e.g., '/api/management/', '/api/users' ,etc. )

// 
// <---------- REPLACE WITH YOUR MONGOOSE CONFIGURATION ---------->
// 
mongoose.connect('mongodb://Test:123456789@ds237475.mlab.com:37475/flame', function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err); // Log to console if unable to connect to database
    } else {
        console.log('Successfully connected to MongoDB'); // Log to console if able to connect to database
        const mongo = require('mongodb').MongoClient;
        const client = require('socket.io').listen(4000).sockets;

        // Connect to mongo
        mongo.connect('mongodb://Test:123456789@ds237475.mlab.com:37475/flame', function(err, db) {
            if (err) {
                throw err;
            }

            console.log('MongoDB connected...');

            // Connect to Socket.io
            client.on('connection', function(socket) {
                let chat = db.collection('chats');

                // Create function to send status
                sendStatus = function(s) {
                    socket.emit('status', s);
                }

                // Get chats from mongo collection
                chat.find().limit(100).sort({ _id: 1 }).toArray(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    // Emit the messages
                    socket.emit('output', res);
                });

                // Handle input events
                socket.on('input', function(data) {
                    let name = data.name;
                    let message = data.message;

                    // Check for name and message
                    if (name == '' || message == '') {
                        // Send error status
                        sendStatus('Please enter a name and message');
                    } else {
                        // Insert message
                        chat.insert({ name: name, message: message }, function() {
                            client.emit('output', [data]);

                            // Send status object
                            sendStatus({
                                message: 'Message sent',
                                clear: true
                            });
                        });
                    }
                });

                // Handle clear
                socket.on('clear', function(data) {
                    // Remove all chats from collection
                    chat.remove({}, function() {
                        // Emit cleared
                        socket.emit('cleared');
                    });
                });
            });
        });



    }
});

// Set Application Static Layout
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/UI/index.html')); // Set index.html as layout
});

// Start Server
app.listen(port, function() {
    console.log('Running the server on port ' + port); // Listen on configured port
});