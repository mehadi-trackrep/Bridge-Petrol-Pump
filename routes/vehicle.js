var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

router.get('/add_vehicle', function (req, res) {

    const Product = Parse.Object.extend('Customer')
    const query = new Parse.Query(Product)
    query
        .find()
        .then(result => {
            console.log(result)
            res.render('vehicle/add_vehicle', { products: result })
        })
        .catch(err => {
            res.render('vehicle/view_vehicle', { error: err })
        })

});


router.get('/view_vehicle', function (req, res) {
    const Product = Parse.Object.extend('Vehicle')
    const query = new Parse.Query(Product)
    query
        .find()
        .then(result => {
            console.log(result)
            res.render('vehicle/view_vehicle', { products: result })
        })
        .catch(err => {
            res.render('vehicle/view_vehicle', { error: err })
        })
})





router.post('/insertInDb', function (req, res, next) {
    var name = req.body.company_name
    var registration = req.body.registration
    var vehicle_type = req.body.vehicle_type
    var color = req.body.color
    var driver = req.body.driver
    var driver_no = req.body.driver_no


    if (name) {
        const Product = Parse.Object.extend('Vehicle')
        const product = new Product()
        product.set('companyName', name)
        product.set('registration', registration)
        product.set('vehicle_type', vehicle_type)
        product.set('color', color)
        product.set('driver', driver)
        product.set('driver_no', driver_no)


        product
            .save()
            .then(result => {
                res.redirect('view_vehicle')
            })
            .catch(err => {
                // render error view here
            })
    }
})



module.exports = router
