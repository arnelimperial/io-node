var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

var User = require('../models/users');
/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/


router.get('/dashboard',ensureAuthenticated, function(req, res, next){
  
  res.render('dashboard', {title: 'DAShBOARD', homeD: 'Home', logout: 'Logout'});

});

router.get('/logout', function(req, res){
    req.logOut();
    req.flash('success_msg', 'You are now logout. Login to access DAShBOARD.');
    //res.render('logout', {title:'Thank You', home: 'Home', login: 'Login'});
    res.redirect('/');

});

router.get('/homeD', function(req, res, next){
    //res.render('homeD', {dashboard: 'Dashboard', logout: 'Logout'});
    res.render('homeD', {dashboard: 'Dashboard', logout: 'Logout'});
});


function ensureAuthenticated(req,res,next){
  if(!req.isAuthenticated()){
    req.flash('error_msg', 'You are not login.');
   res.redirect('/login');
    
  }
}


module.exports = router;
