var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
//var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');
//mongoose.connect('mongodb://localhost:27017/log', { useNewUrlParser: true });
var User = require('../models/users');


router.get('/', urlencodedParser, function (req, res, next) {
  res.render('index',{title: 'FORMS', errors: req.session.errors, login: 'Login'});
  req.session.errors = null;
});


router.post('/', urlencodedParser,function (req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var passwordC = req.body.passwordC;
  //console.log(req.body);
  req.checkBody('username', 'Name field requires at least 3 characters').isLength({min: 3});
  req.checkBody('email', 'Your email is invalid.').isEmail();
  req.checkBody('password', 'Password must contains at least 8 characters with alphabet(lowercase and uppercase) and numbers only').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");
  req.checkBody('password', 'Your password requires min.of 8 characters').isLength({min: 8});
  req.checkBody('password', 'Password should be match.').equals(req.body.passwordC);
  


  var errors = req.validationErrors();
  if(errors){
     req.session.errors = errors;
     req.session.success = false;
     res.redirect('/');
     //req.session.error = null;

  }
  else{ 
    req.session.success = true;
    res.render('login', {data1: req.body.username, data2: req.body.email, success: req.session.success});
    req.session.success = null;
  
     var newUser = new User({
       username: username,
       email: email,
       password: password

     });
     
     User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
     });

    
     
  }

  
});





router.get('/404', function (req, res) {
    res.send('404');
});

//configure


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUserName(username, function(err,user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Username is not in our database.'});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
          

          
        }else{
          return done(null, false, {message: 'Invalid password'});
        }
      });

    
    });


}));




passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
});


router.get('/login',urlencodedParser, function(req, res, next) {
  
  res.render('login',{home: 'Home'});
});

router.post('/login',
  passport.authenticate('local',  { successRedirect:'/dashboard', failureRedirect: '/login', failureFlash: true}),
  function(req, res) {
  
    

    
});



router.get('/dashboard', urlencodedParser, function(req, res, next){
  
  res.render('dashboard', {title: 'DAShBOARD', homeD: 'Home', logout: 'Logout'});

});

router.get('/logout', function(req, res){
    req.logOut();
    req.flash('success_msg', 'You are now logout. Login to access DAShBOARD.');
    res.render('logout', {title:'Thank You', home: 'Home', login: 'Login'});

});

router.get('/homeD', function(req, res, next){
    res.render('homeD', {dashboard: 'Dashboard', logout: 'Logout'});
});


function ensureAuthenticated(req,res,next){
  if(!req.isAuthenticated()){
    req.flash('error_msg', 'You are not login.');
   res.redirect('/login');
    
  }
}


module.exports = router;