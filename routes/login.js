var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');

router.get('/',function( req,res ) {
    console.log("in login");
    console.log(req.body);
    UserModel.findOne({email:req.body.email, password:req.body.password},function(err,user){
        if(!err){
            res.send({status:true, message:"User found", data:user});
        }
        else{
            res.send({status:false, message:"User not found"});
        }
    });
});

module.exports = router;