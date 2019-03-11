var express = require('express');
var router = express.Router();
var User = require('../models/user'); // Model import where "user.js" is a mongoose Model
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dateTime = require('node-datetime');
var User = require('../models/user');
var CoinDetails = require('../models/coinDetails');
// ............
global.fetch = require('node-fetch');
const cc = require('cryptocompare');
var pass = "smmh3749";
var nodemailer = require("nodemailer");

// ##########  NEW CODES #############

router.get('/report', function(req, res, next){
  var username = "";
  if(req.session.username){
    console.log("user is logged in ..");
    username = req.session.username;
  }
  req.session.errors = null;
  res.render('reports', {username: username});
});














var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mozzie8ai@gmail.com",
        pass: pass
    },
    tls: {
      rejectUnauthorized: true
    }
});
var rand, mailOptions, host, link, global_email;

router.get('/aboutUs', function(req, res, next){
  res.render('AboutPage');
});

// Register
router.get('/register', function(req, res){
  var username = "";
  if(req.session.username){
    console.log("user is logged in ..");
    username = req.session.username;
  }
  req.session.errors = null;
  res.render('register', {username: username});
});

// HomePage
router.get('/home', function (req, res) {
    var username = "";
    if(req.session.username){
      console.log("\n--------------------- user is logged in .........................\n");
      username = req.session.username;
    }
    res.render('index', {username: username});
});

function ensureAuthenticated(req, res, next){
    req.flash('user',req.session.user);
    if(req.isAuthenticated()){
      next();
    }else{
        req.flash('error_msg', 'You are not logged in!!');
        res.redirect('/users/login');
    }
}

// Login
router.get('/login', function(req, res, next){
  var username = "";
  if(req.session.username){
    console.log("user is logged in ..");
    username = req.session.username;
  }
  res.render('login', {username: username});
});

router.get('/verify/:id', function(req,res){
  console.log("check the global_email:");
  console.log(global_email);
  if(req.params.id == rand){
    User.updateOne({email: global_email}, {$set:{"approved": true}}, function(er, result){
      if(err) throw err;
      else{
        req.flash('success_msg', "Email is verified!!");
        console.log("verified the email");
      }
    });
  }
  res.redirect('/users/login');
});

// Register User
router.post('/register', function(req, res){
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    
    host = req.get('host');
    console.log(host);
    // Validation    "req.checkBody(name, msg).fun()""

    req.checkBody('password', 'Passwords do not match!!').equals(password2);

    var errors = req.validationErrors();
    if(errors){
        console.log('error occurs');
        req.flash('error_msg', "Error!! Password doesn't match");
        res.redirect('/users/register');
    }else{
      console.log('-------- enter ---------');
      User.find({
        email: email  // ############## EMAIL unique rakhci ..
      },function(err, results) {
          if (err) return console.error(err);
          console.log(results);
          if (results.length > 0) {
            req.flash('error_msg', 'Email is not unique, try with another one!');
            res.redirect('/users/register');
          }else{
            // To store data(or, create a new user)
              var newUser = new User({
                  name: name,
                  email: email,
                  username: username,
                  password: password,
                  approved: false
              });
              User.createUser(newUser, function(err, user){  // etai user Model er "module.exports.createUser" line er code ta , jeta baire theke access korte parci ..
                  if(err) throw err;
                  // console.log(user);
              });

              rand = Math.floor((Math.random() * 100) + 54);
              link = "http://"+host+"/users/verify/id="+rand;

              console.log(link);
              global_email = email;
              mailOptions={
                  from: '"MMH-MKBS"<mehadi541@gmail.com>',
                  to : email,
                  subject : "Please confirm your Email account",
                  html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
              }

              console.log(mailOptions);

              smtpTransport.sendMail(mailOptions, function(error, response){
               if(error){
                      console.log(error);
                  res.end("error");
               }else{
                      console.log("Message sent: " + response.message);
                  res.end("sent");
                   }
              });

              req.flash('success_msg', 'Email verification code is sent!!');
              res.redirect('/users/login');
              // console.log('PASSED');
          }
      });
    }
        // console.log("name: "+name + " username: "+username+" email "+email+" password "+password + " password2 "+password2);
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  function(username, password, done) {
    User.getUserByEmail(username, function (err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: 'Unknown User' });
        }
        User.comparePassword(password, user.password, function (err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid password' });
          }
        });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserByID(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
//   passport.authenticate('local',{session: true, successFlash: 'Logged in!', successRedirect: '/',
//                                    failureRedirect: '/login',
//                                    failureFlash: true })
// );
  passport.authenticate('local', {successRedirect: '/users/home', failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    console.log("\n===========\nThe logged in user: "+req.user.username);
    res.redirect('/users/register');
  });

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'Successfully logged out!!');
    res.redirect('/users/login');
});

module.exports = router;
