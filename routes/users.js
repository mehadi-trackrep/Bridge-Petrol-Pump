var express = require('express');
var router = express.Router();
var User = require('../models/user'); // Model import where "user.js" is a mongoose Model
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dateTime = require('node-datetime');
var User = require('../models/user');
var BillDetails = require('../models/bill_details');

var pass = "smmh3749";
var nodemailer = require("nodemailer");

// ##########  NEW CODES #############

var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

router.get('/report', ensureAuthenticated, function(req, res, next){
// router.get('/report', function(req, res, next){
  var username = "";
  if(req.session.name){
    console.log("\n======> logged in obostai ace =============\n");
    console.log("==> The user name is: ", req.session.name);
    username = req.session.name;
  }
  req.session.errors = null;
  res.render('reports', {username: username});
});

router.get('/bill_for_vehicle', function(req, res, next){
  var username = "";
  if(req.session.name) username = req.session.name;
  res.render('bill_for_vehicle', {username: username});
});

router.post('/bill_for_vehicle', function(req, res, next){
    var vehicle = req.body.vehicle;
    var company = req.body.company;
    var product = req.body.radio_btn;
    var quantity = req.body.quantity;
    var price = req.body.price;
    var discount = req.body.discount;
    var total_price = req.body.total_price;

    var mail = req.session.user;

    // console.log("#### mail: ####" + user);

      // To store data(or, create a new user)
    var newBills = new BillDetails({
        email: mail,
        vehicle: vehicle,
        company: company,
        product: product,
        quantity: quantity,
        price: price,
        discount: discount,
        total_price: total_price
    });
    BillDetails.createBillDetails(newBills, function(err, user){  // etai user Model er "module.exports.createUser" line er code ta , jeta baire theke access korte parci ..
        if(err) throw err;
        console.log(user);
    });

    //req.flash('success_msg', 'Email verification code is sent!!');
    res.redirect('/users/login');
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
  if(req.session.name){
    console.log("user is logged in ..");
    username = req.session.name;
  }
  req.session.errors = null;
  res.render('register', {username: username});
});

// HomePage
router.get('/home', function (req, res) {
    var username = "";
    if(req.session.name){
      console.log("\n--------------------- user is logged in .........................\n");
      username = req.session.name;
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
  if(req.session.name){
    console.log("user is logged in ..");
    username = req.session.name;
  }
  res.render('login', {username: username});
});


// Register User
router.post('/register', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var location = req.body.location;
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
                  location: location,
                  password: password,
                  approved: false
              });
              User.createUser(newUser, function(err, user){  // etai user Model er "module.exports.createUser" line er code ta , jeta baire theke access korte parci ..
                  if(err) throw err;
                  // console.log(user);
              });

              req.flash('success_msg', 'Successfully registered!!');
              res.redirect('/users/login');
          }
      });
    }
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true
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
