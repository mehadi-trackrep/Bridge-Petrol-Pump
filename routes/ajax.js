var express = require("express");
var router = express.Router();
var Parse = require("parse/node");

router.get('/check-registration', async function (req, res) {

    console.log("==> registration name: " + req.query.id)
    var reg = req.query.id
    const Vehicle = Parse.Object.extend("Vehicle");
    const query = new Parse.Query(Vehicle);
    var check = [];
    query.equalTo("registration", reg);
    query
        .find()
        .then(result => {

            if (result.length > 0) {
                res.send(true);
                console.log(result[0].registration)
            }
            else {
                console.log("false")
                res.send(false)
            }
        })
        .catch(err => {
            console.log(err);
        })

});

router.get("/get-company", async function (req, res) {

    console.log("get-company");
    console.log(req.query.id)
    var regId = req.query.id
    const Vehicle = Parse.Object.extend("Vehicle");
    const query = new Parse.Query(Vehicle);
    query.include("companyName");
    result = await query.equalTo("registration", regId).first()
    // .then(result => {
    //     res.send(result)
    // })
    // .catch(err => {
    //     res.send({});
    // });

    res.send(result)
    // Parse.User.logOut()
    //     .then(result => {
    //         console.log(result);
    //         res.redirect("/");
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.redirect("/");
    //     });  
});

router.get('/update-bills', function (req, res) {
    console.log("Update bills: " + obj);
    var obj = req.query.obj;
    res.send("obj: " + obj);
});

module.exports = router;
