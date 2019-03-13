var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var Parse = require('parse/node');

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




Parse.Promise = global.Promise;
Parse.initialize("zDmdrUrvD3WFdIM4", "", "TtW6WcNARzGvVbBN");
Parse.serverURL = 'https://bppbackend.herokuapp.com/api';

//################## sample insert example below ##########################
// const GameScore = Parse.Object.extend("GameScore");
// const gameScore = new GameScore();

// gameScore.set("score", 1337);
// gameScore.set("playerName", "Sean Plott");
// gameScore.set("cheatMode", false);

// gameScore.save()
// .then((gameScore) => {
//   // Execute any logic that should take place after the object is saved.
//   console.log('New object created with objectId: ' + gameScore.id);
// }, (error) => {
//   // Execute any logic that should take place if the save fails.
//   // error is a Parse.Error with an error code and message.
//   console.log('Failed to create new object, with error code: ' + error.message);
// });



//app
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//modules
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With,Accept,Content-Type, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'GET,POST,PUT,PATCH,DELETE'
        );
        return res.status(200).json({});
    }
    next();
});
//route
//####
// var baseRouter = require('./api/v1/route/base');
// app.use('/api/v1/base', baseRouter);


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

//error handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;
