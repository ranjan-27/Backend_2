// this is for loginModel for user or admin 

const mongoose=require('mongoose');
const User = require('./users');
//schema
const authUserSchema =mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
   password:{
        type:String,
        required:true,
        minlength:6,// the password must be atleast 6 length
    },
    role:{
        type:String,
        enum:['user','admin'], // who can login either user or admin
        default:'user',
    }
});
const AuthUser=mongoose.model('AuthUser',authUserSchema);

module.exports=AuthUser;