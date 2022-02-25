//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
  firstName : {
    type:String ,
    required: true
  } ,
  lastName : {
    type:String ,
    required: true
  } ,
   email:{
     type:String ,
     required: true
   } ,
   city:{
     type:String ,
     required: true

   },
   password:{
     type:String ,
     required: true
   },
   avatar:{
     type:String ,
     required: true
   } ,
   isAdmin :{
     type:Boolean  ,
     required: true
   },
   created_At :{
     type:Date  ,
     required: true
   },
   isActive :{
     type:Boolean  ,
     required: true
   },
   isSpeaker :{
     type:Boolean  ,
     Default: false
   },
   skills :{
     type:[String]
    // required: true
   }

  }
);
userSchema.methods.hashPassword = (password)=>{
  return bcrypt.hashSync(password , bcrypt.genSaltSync(10));
};

userSchema.methods.comparePasswords = (password,hash)=>{
  return bcrypt.compareSync(password,hash);
};

userSchema.methods.isAdminOne = function() {
    return (this.isAdmin === "true");
};

let User = mongoose.model('User' ,userSchema);

module.exports = User ;
