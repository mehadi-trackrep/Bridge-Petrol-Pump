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
            res.render('vehicle/add_vehicle', { customers: result })
        })
        .catch(err => {
            res.render('vehicle/view_vehicle', { error: err })
        })

});


router.get('/view_vehicle', function (req, res) {
    const Product = Parse.Object.extend('Vehicle')
    const query = new Parse.Query(Product)
    query.include("companyName");
    query
        .find()
        .then(result => {
            console.log(result)
            res.render('vehicle/view_vehicle', { vehicles: result })
        })
        .catch(err => {
            res.render('vehicle/view_vehicle', { error: err })
        })
})





router.post('/insertInDb', function (req, res, next) {
    const customerId = req.body.company_name
    const registration = req.body.registration
    const vehicle_type = req.body.vehicle_type
    const color = req.body.color
    const driver = req.body.driver
    const driver_no = req.body.driver_no
    console.log("customer = " + customerId);
    const Customer = Parse.Object.extend("Customer");
    const Vehicle = Parse.Object.extend("Vehicle");
    const query = new Parse.Query(Customer);

    const check_select2 = req.body.check_select2;

    console.log("check_select2: " + check_select2.text);

    query
        .get(customerId)
        .then(customer => {
            console.log("==> customer data: " + customer);
            const vehicle = new Vehicle();
            vehicle.set("companyName", customer);
            vehicle.set("registration", registration);
            vehicle.set("vehicle_type", vehicle_type);
            vehicle.set("color", color);
            vehicle.set("driver", driver);
            vehicle.set("driver_no", driver_no);
            console.log("then ==> customer data: " + customer);
            vehicle
                .save()
                .then(result => {

                    res.redirect("/vehicle/view_vehicle");
                })
                .catch(err => {
                    // render error view here
                    console.log("error bal" + err);
                });
        })
        .catch(err => {
            console.log(err);
        });

})



module.exports = router
