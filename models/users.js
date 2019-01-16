var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
mongoose.connect('mongodb://data5Z:*/*/Basic7@ds211083.mlab.com:11083/data');
var db = mongoose.connection;


var UserSchema = mongoose.Schema({
    email: {type: String}, password: {type: String, required:true}, username:{type: String, required: true} 

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB
            newUser.password = hash;
            newUser.save(callback);
        });
    });

};


module.exports.getUserByUserName = function(username, callback){
    var query = {username:username};
    User.findOne(query, callback);
    
};

module.exports.getUserById = function(id, callback){
   
    User.findById(id, callback);
};



module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};





 