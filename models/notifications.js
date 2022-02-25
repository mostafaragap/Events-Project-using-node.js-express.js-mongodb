

//jshint esversion:6

const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema(
  {
  senderId : {
    type:String ,
    required: true
  } ,
  sendTo: {
    type:String
  },
  senderImg : {
    type:String ,
    required: true
  } ,
   senderName:{
     type:String ,
     required: true
   } ,
   eventId:{
     type:String
   } ,
   eventTitle:{
     type:String
   } ,
   eventDate:
   {
     type:Date
   },
   type :{
     type:String ,
     required: true
   },
   created_At:{
     type:Date ,
     required:true
   }
 }
);

let Notification = mongoose.model('Notification' ,notificationSchema);

module.exports = Notification ;
