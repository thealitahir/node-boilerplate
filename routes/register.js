var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');

router.post('/', function (req, res) {
    console.log("in register")
    console.log(req.body);
    var newUser = new UsersModel();
    newUser.firstName = req.body.fullName;
    newUser.lastName = req.body.lastName;
    newUser.username = req.body.email;
    newUser.password = req.body.password;

    newUser.save((err, doc) => {
        if (!err) {
            res.send({ status: true, message: "User registered successfully", data: doc });
        }
        else {
            res.send({status: false, message: "User not found"});
        }
    });
});

module.exports = router;