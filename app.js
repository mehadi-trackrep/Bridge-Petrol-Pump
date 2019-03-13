var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/BPP');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');


var Parse = require('parse/node');
Parse.Promise = global.Promise;
Parse.initialize("zDmdrUrvD3WFdIM4", "", "TtW6WcNARzGvVbBN");
Parse.serverURL = 'https://bppbackend.herokuapp.com/api';

//sample insert example below
const GameScore = Parse.Object.extend("GameScore");
const gameScore = new GameScore();

gameScore.set("score", 1337);
gameScore.set("playerName", "Sean Plott");
gameScore.set("cheatMode", false);

gameScore.save()
.then((gameScore) => {
  // Execute any logic that should take place after the object is saved.
  console.log('New object created with objectId: ' + gameScore.id);
}, (error) => {
  // Execute any logic that should take place if the save fails.
  // error is a Parse.Error with an error code and message.
  console.log('Failed to create new object, with error code: ' + error.message);
});

//Init App
var app = express(); // Only we have to 'set' view engine
                     // otherwise 'use' some folder/modules
                     // for this we have to use:
                     // app.set(), app.use()

//View Engine
app.set('views', path.join(__dirname, 'views'));  // views + views er under a joto gula folder ace shobar path dite hobe ..
app.set('view engine', 'ejs');


// BodyParser Middleware
//modules
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());  // To set global session value ..................................

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.info = req.flash('info');
  res.locals.error = req.flash('error');
  res.locals.email_flash = req.flash('email_flash');
  res.locals.user = req.user || null;
next();
});

app.use('/', routes);  // routes for HomePage
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 4549));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});


exports = module.exports = app;
