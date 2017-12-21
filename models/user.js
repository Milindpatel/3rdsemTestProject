const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

//create openxc Schema & model
const openxcSchema = new Schema({
    username: {
        type: String,
        index : true,
        required : [true,'Name field is required']
    },
    email : {
        type : String,
        required : [true,'email field is required']
    },
    password:{
        type: String,
        required : [true,'password field is required']
    },
    phone: {
        type : String,
        required : [true,'phone field is required']
    },
    vin:{
        type:String,
        //required : [true,'vin field is required']
    },
    gcm:{
        type: String,
        //required : [true,'gcm field is required']
    },
    isActive:{
        type:  Boolean,
        default: false, 
    },
    isActiveAt:{
        type : Date,
       
    },
    role:{
        type: String,
        //required : [true,'gcm field is required']
    },
   
    

});

openxcSchema.plugin(mongooseUniqueValidator);

// const openxc = mongoose.model('openxc',openxcSchema);

var User = module.exports = mongoose.model('user',openxcSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUserName = function(username, callback){
    var query = {username: username};
    User.findOne(query,callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id,callback);
};

module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,function(err,isMatch){
        if(err) throw err;
        callback(null, isMatch);
    })
}