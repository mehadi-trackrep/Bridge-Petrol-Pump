var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

// Homepage
router.get('/', function (req, res) {
  //res.redirect('/users/home')
  res.render('index')
})

router.get('/login', function (req, res) {
  //res.redirect('/users/home')
  res.render('login')
})

router.get('/register', function (req, res) {
  // var currentUser = Parse.User.current();
  // if (currentUser) {
  //     // do stuff with the user
  //     console.log("user ase yaye "+currentUser);
      
  // } else {
  //     // show the signup or login page
  // }
  // res.render('register')
  Parse.User.currentAsync().then(function(user) {
      // do stuff with your user
      console.log("user ase yaye "+user);
      res.render('register');
  });
})

router.post('/login', function (req, res) {
  var email ="test";
  var pass = req.body.password;
  const user = Parse.User.logIn("myname", "mypass");
  if(user)
  {
    console.log("User   "+user);
    res.redirect('/register');
  }
  else{
    res.redirect('/login');
  }
})

router.post('/register', function (req, res) {
  
  var name = req.body.name
  var email = req.body.email
  var location = req.body.location
  var password = req.body.password
  var password2 = req.body.password2

  var user = new Parse.User();
  user.set("username", name );
  user.set("password", password);
  user.set("email", email);

  // other fields can be set just like with Parse.Object
  user.set("location", location);
  user.signUp()
  .then(result => {
    //alert("Successfully registered");
    res.redirect('/login')
    // alert("Successfully registered");
  })
  .catch(err => {
    // render error view here
    alert(err);
  });
  
})

router.get('/report', function(req, res, next){
  res.render('reports')
})

router.get('/aboutUs', function(req, res, next){
  res.render('AboutPage')
})


module.exports = router
