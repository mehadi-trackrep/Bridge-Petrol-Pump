var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

router.get('/bill_for_vehicle', function (req, res, next) {

    res.render('bill/bill_for_vehicle');
})

router.get('/find_bills', function (req, res, next) {

    res.render('bill/find_bills')
})

router.get('/quick_bill', function (req, res, next) {

    res.render('bill/quick_bill')
})

router.post('/bill_for_vehicle', function (req, res, next) {

    var check_obj = {
        'company': 'hanif', 'vehicle': 'micro',
        'optionsRadios': 'petrol', 'stock': '1000', 'after_stock': '990',
        'price': '100', 'discount': '10'
    };
    console.log("ashce");
    res.render('bill/confirm_bill_for_vehicle', { 'result': check_obj, 'price': 100, 'discount': 10 });

})

router.post('/find_bills', function (req, res, next) {

})

router.post('/quick_bill', function (req, res, next) {

})

module.exports = router