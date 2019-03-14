var express = require('express');
var router = express.Router();
var User = require('../models/user'); // Model import where "user.js" is a mongoose Model
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dateTime = require('node-datetime');
var User = require('../models/user');
var BillDetails = require('../models/bill_details');
var CustomerDetails = require('../models/add_customer');
var VehicleDetails = require('../models/add_vehicle');
var ProductDetails = require('../models/add_product');

var pass = "smmh3749";
var nodemailer = require("nodemailer");

// ##########  NEW CODES #############

var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

router.get('/add_customer', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  console.log("Get asche");
  res.render('add_customer', {username: username});
});


router.post('/add_customer', function(req, res, next){

  var company_name = req.body.company_name;
  var address = req.body.address;
  var email = req.body.email;
  var contact_person = req.body.contact_person;
  var contact_no = req.body.contact_no;

  CustomerDetails.find({
    company_name: company_name  // ############## EMAIL unique rakhci ..
  },function(err, results) {
      if (err) return console.error(err);
      console.log(results);
      if (results.length > 0) {
        req.flash('error_msg', 'This company already exists!, try with another one!');
        res.redirect('/users/add_customer');
      }else{
          var newCustomer = new CustomerDetails({
            company_name: company_name,
            address:address,
            email: email,
            contact_person: contact_person,
            contact_no: contact_no
          });
          CustomerDetails.createCustomerDetails(newCustomer, function(err, user){  // etai user Model er "module.exports.createUser" line er code ta , jeta baire theke access korte parci ..
              if(err) throw err;
              // console.log(user);
          });
          req.flash('success_msg', 'Successfully customer added!!');
          res.redirect('/users/view_customers');
      }
  });
});

router.get('/view_customers', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  console.log("Get asche");

  CustomerDetails.find({},function(err, results) {
    if (err) return console.error(err);
    console.log(results);
      res.render('view_customers', {results: results, username: username});
  });  
});

router.post('/view_customers', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  res.render('view_customers', {username: username});
  console.log("post hoiche");
});

router.get('/view_vehicle', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  VehicleDetails.find({},function(err, results) {
    if (err) return console.error(err);
    console.log(results);
      res.render('view_vehicle', {results: results, username: username});
  }); 
});


router.post('/view_vehicle', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  res.render('view_vehicle', {username: username});
  console.log("post hoiche");
});

router.get('/add_vehicle', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }

  CustomerDetails.find({},function(err, results) {
    if (err) return console.error(err);
    console.log(results);
      res.render('add_vehicle', {results: results, username: username});
  });  
});


router.post('/add_vehicle', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  var company_name = req.body.company_name;
  var registration = req.body.registration;
  var vehicle_type = req.body.vehicle_type;
  var color = req.body.color;
  var driver = req.body.driver;
  var driver_no = req.body.driver_no;

  VehicleDetails.find({
    registration: registration  // ############## EMAIL unique rakhci ..
  },function(err, results) {
      if (err) return console.error(err);
      console.log(results);
      if (results.length > 0) {
        req.flash('error_msg', 'This Vehicle already exists!, try with another one!');
        res.redirect('/users/add_vehicle');
      }else{
          var newVehicle = new VehicleDetails({
            company_name: company_name,
            registration:registration,
            vehicle_type: vehicle_type,
            color: color,
            driver: driver,
            driver_no: driver_no
          });
          CustomerDetails.createCustomerDetails(newVehicle, function(err, user){  // etai user Model er "module.exports.createUser" line er code ta , jeta baire theke access korte parci ..
              if(err) throw err;
              // console.log(user);
          });
          req.flash('success_msg', 'Successfully vehicle added!!');
          res.redirect('/users/view_vehicle');
      }
  });
});






router.get('/view_stock', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  ProductDetails.find({},function(err, results) {
    if (err) return console.error(err);
      res.render('view_stock', {results: results, username: username});
  }); 
});


router.post('/view_stock', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  res.render('view_stock', {username: username});
  console.log("post hoiche");
});


router.get('/view_products', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  ProductDetails.find({},function(err, results) {
    if (err) return console.error(err);
      res.render('view_products', {results: results, username: username});
  }); 
});


router.post('/view_products', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  res.render('view_products', {username: username});
  console.log("post hoiche");
});




router.get('/add_stock', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  ProductDetails.find({},function(err, results) {
    if (err) return console.error(err);
      res.render('add_stock', {results: results, username: username});
  }); 
});


router.post('/add_stock', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  var product = req.body.product;
  var quantity = req.body.quantity;
  var buying_price = req.body.buying_price;
  var selling_price = req.body.selling_price;

  ProductDetails.find({
    product: product  // ############## EMAIL unique rakhci ..
  },function(err, results) {
      if (err) return console.error(err);
      console.log("==> products: ",results);
      console.log("--> quantity: ", Number(results[0].quantity));
      var q = Number(results[0].quantity) + Number(quantity);
      ProductDetails.findOneAndUpdate({product: product }, { "$set": { "quantity": q, "buying_price": buying_price, "selling_price": selling_price}}).exec(function(err, user){
        if(err) {
            console.log(err);
            res.status(500).send(err);
            req.flash('error_msg', 'Adding stock failed!!');
            res.redirect('/users/add_stock');
        }else{
          req.flash('success_msg', 'Successfully stock added!!');
          res.redirect('/users/view_stock');
        }
     });
  });
});



router.get('/find_bills', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  console.log("Get asche");
  res.render('find_bills', {username: username});
});


router.post('/find_bills', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  res.render('find_bills', {username: username});
  console.log("post hoiche");
});

router.get('/quick_bill', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  console.log("Get asche");
  res.render('quick_bill', {username: username});
});


router.post('/quick_bill', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  res.render('quick_bill', {username: username});
  console.log("post hoiche");
});


router.get('/add_product', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  req.session.errors = null;
  console.log("Get asche");
  res.render('add_product', {username: username});
});


router.post('/add_product', function(req, res, next){
  var username = "";
  if(req.session.name){
    username = req.session.name;
  }
  var product = req.body.product;
  ProductDetails.find({
    product: product  // ############## EMAIL unique rakhci ..
  },function(err, results) {
      if (err) return console.error(err);
      if (results.length > 0) {
        req.flash('error_msg', 'This Product already exists!, try with another one!');
        res.redirect('/users/add_product');
      }else{
          var newProduct = new ProductDetails({
            product: product,
            quantity:0,
            buying_price: 0,
            selling_price: 0
          });
          ProductDetails.createProductDetails(newProduct, function(err, user){  // etai user Model er "module.exports.createUser" line er code ta , jeta baire theke access korte parci ..
              if(err) throw err;
              console.log("==>: ",user);
          });
          console.log("product added!");
          req.flash('success_msg', 'Successfully product added!!');
          res.redirect('/users/view_products');
      }
  });
});


// router.get('/report', ensureAuthenticated, function(req, res, next){
router.get('/report', function(req, res, next){
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
