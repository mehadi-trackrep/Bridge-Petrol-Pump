var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var bodyParser = require('body-parser')
var Parse = require('parse/node')


var mongo = require('mongodb')
var mongoose = require('mongoose')

const dbUrl =
  'mongodb+srv://ifta:123@icluster-txko2.mongodb.net/test?retryWrites=true'
mongoose.connect(dbUrl)

// mongoose.connect('mongodb://localhost/BPP');
// var db = mongoose.connection;

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

Parse.Promise = global.Promise
Parse.initialize('zDmdrUrvD3WFdIM4', '', 'TtW6WcNARzGvVbBN')
Parse.serverURL = 'https://bppbackend.herokuapp.com/api'

//################## sample insert example below ##########################
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

// app
var app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// modules
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With,Accept,Content-Type, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    return res.status(200).json({})
  }
  next()
})

/// ### route ###
var billRouter = require('./routes/bill')
var customerRouter = require('./routes/customer')
var productRouter = require('./routes/product')
var stockRouter = require('./routes/stock')
var vehicleRouter = require('./routes/vehicle')

app.use('/bill', billRouter)
app.use('/customer', customerRouter)
app.use('/product', productRouter)
app.use('/stock', stockRouter)
app.use('/vehicle', vehicleRouter)
app.use('/', indexRouter) // routes for HomePage
app.use('/users', usersRouter)

// error handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({
    error: {
      message: err.message
    }
  })
})

module.exports = app