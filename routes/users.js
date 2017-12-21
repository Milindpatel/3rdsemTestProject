var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//*********** Get All User ***********
router.get('/registered', function (req, res, next) {
    var data = {
        "Data": ""
    };
    User.find({}).then(function (rows) {
        data["Data"] = rows;
        res.send(rows);
        console.log(rows)
    })
});

//***********Login***********
router.get('/login', function (req, res) {
    res.render('login')
});

//***********Register User***********
router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var phone = req.body.phone;
    var vin = req.body.vin;
    var gcm = req.body.gcm;

    //Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'UserName is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password2 is required').equals(req.body.password);
    req.checkBody('phone', 'Phone is required').notEmpty();
    req.checkBody('vin', 'vin is required').notEmpty();
    req.checkBody('gcm', 'gcm is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.send(errors)
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            gcm: gcm,
            vin: vin,
            phone: phone,
            isactive: true,
            role: "user"
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        // res.redirect('login');
        res.send("success register1");
    }
});



passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUserName(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Invalid username or password' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid username or password' });
                }
            })
        })
    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

//*********** Login ***********
router.post('/login',
    passport.authenticate('local'),
    // {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
    function (req, res) {
        // res.redirect('/');
        res.send("success login");
    });

//*********** Logout ***********
router.get('/logout', function (req, res) {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

//*********** Get User by id ***********
router.get('/:id', function (req, res, next) {

    User.findById({ _id: req.params.id }).then(function (rows) {
        res.send(rows);
        console.log(rows);
    });
    console.log("success");
});

router.put('/isActive/:id', function (req, res) {
    req.body.isActiveAt=new Date();
    User.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
        User.findOne({ _id: req.params.id }).then(function (rows) {
            res.send(rows)
            console.log(rows)
        })

    })
})


module.exports = router;