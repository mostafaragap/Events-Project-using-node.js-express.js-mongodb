

//jshint esversion:6

const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema(
  {
  event_id : {
    type:String ,
    required: true
  } ,
  speaker_id : {
    type:String ,
    required: true
  } ,
   type:{
     type:String ,
     required: true
   }
 }
);

let Notification = mongoose.model('Notification' ,notificationSchema);

module.exports = Notification ;
