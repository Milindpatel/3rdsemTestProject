const express = require('express');
const router = express.Router();
const userlist = require('../models/user');
const rpmlist = require('../models/rpm');
const dtclist = require('../models/dtc');
var FCM = require('fcm-push');

function ensureAuthenticated(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        // req.flash('error_msg', 'You are not logged in');
        res.redirect('/account/login');
    }
}
//npm install fcm-push
//get a list  from db
router.get('/userlist',ensureAuthenticated, function (req, res, next) {
    if(req.user.role=="user")
    {
        res.redirect('/home/rpmlist');
    }
    var data = {
        "Data": ""
    };
    userlist.find({role:"user"}).then(function (rows) {
        data["Data"] = rows;
        //res.send(data);
        //console.log(req.user);
        res.render('userlist', { UserlistModel: data,user:req.user });
        
    })
    //res.render('userlist');
});

router.get('/userDashboard',ensureAuthenticated, function (req, res, next) {
    
    userlist.find({username:req.query.id}).then(function (row) {
        data = row[0];
        var currentdt=new Date();
        var minutagodt=new Date(currentdt - 60000);
        req.session.currentuser=req.query.id;
        
        if(data.isActive==true && (data.isActiveAt>minutagodt && data.isActiveAt<currentdt))
        {
            data.isActive=true;
        }
        else
        {
            data.isActive=false;
        }
        res.render('userDashboard', { UserModel: data,user:req.user });
    })
    //res.render('userlist');
});
router.get('/diagnostic',ensureAuthenticated, function (req, res, next) {
    userlist.find({username:req.session.currentuser}).then(function (rows) {
        console.log(rows[0]._id);
        var data=dtclist.find({ user: rows[0]._id }).then(function (data) {
            
            console.log(data);
            res.render('diagnostic', { UserModel: data,user:req.user });
        });
        
    });
});

router.get('/rpmlist',ensureAuthenticated, function (req, res, next) {
    var data = {
        "Data": ""
    };
    rpmlist.find({}).then(function (rows) {
        data["Data"] = rows;
        //res.send(data);
        console.log(data);
        res.render('rpmlist', { RpmlistModel: data ,user:req.user });
        
    })
    //res.render('userlist');
});

router.get('/sendNotification', function (req, res, next) {
    
    var serverKey = 'AAAAbpTsC4g:APA91bHiXkzVwKNB_C99kMRtEFXVXi_qw474cEzq2CMDfAgGZ3-SHexmZcRmnnCOX3-3GuX_yquOuNGK1MMdIDnLjtoWOMQEi1QVlRz5XXYO2c5sa-mg3uhMPQ9THTV7BYw5wAoUgXcL';
    var fcm = new FCM(serverKey);
    
    var message = {
        to: '/topics/global', // required fill with device token or topics
        //collapse_key: 'your_collapse_key', 
        data: {
            message: 'Test notification'
        },
        notification: {
            title: 'Test notification',
            body: 'Body of test push notification'
        }
    };
    
    //callback style
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
            res.send("Failure");
        } else {
            console.log("Successfully sent with response: ", response);
            res.send("Success");
        }
    });
    
    /* //promise style
    fcm.send(message)
        .then(function(response){
            console.log("Successfully sent with response: ", response);
        })
        .catch(function(err){
            console.log("Something has gone wrong!");
            console.error(err);
        }) */
});

module.exports = router;

