var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

router.get('/add_stock', function (req, res) {

  const Product = Parse.Object.extend('Product')
  const query = new Parse.Query(Product)
  query
    .find()
    .then(result => {
      console.log(result)
      res.render('stock/add_stock', { products: result })
    })
    .catch(err => {
      res.render('stock/view_stock', { error: err })
    })

});


router.get('/view_stock', function (req, res) {
  const Product = Parse.Object.extend('Product')
  const query = new Parse.Query(Product)
  query
    .find()
    .then(result => {
      console.log(result)
      res.render('stock/view_stock', { products: result })
    })
    .catch(err => {
      res.render('stock/view_stock', { error: err })
    })
})





router.post('/insertInDb', function (req, res, next) {
  var name = req.body.name;
  var add_qantity = req.body.quantity
  var buying_price = req.body.buying_price
  var selling_price = req.body.selling_price

  var Product = Parse.Object.extend("Product");
  var query = new Parse.Query(Product);
  query.equalTo("name", name);
  console.log("frist query: " + query.first());
  query.find()
    .then(function (object) {
      var add = Number(add_qantity) + Number(object.qantity)
      console.log("object paiche");
      object.set("qantity", add);
      object.set("buying_price", buying_price);
      object.set("selling_price", selling_price);
      object.save()
      res.render('view_stock', { products: result })

    })
    .catch(err => {
      res.render('stock/add_stock', { error: err })
    })
});




module.exports = router
