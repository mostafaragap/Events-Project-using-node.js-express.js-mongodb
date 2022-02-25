//jshint esversion:6

const mongoose = require('mongoose');


const meetingSchema = new mongoose.Schema(
  {
  author : {
    type:String ,
    required: true
  } ,
  eventId: {
    type:String
  },
  speakerId : {
    type:String ,
    required: true
  } ,
   created_At:{
     type:Date ,
     defalult:Date.now()
   }
 }
);

let Meeting = mongoose.model('Meeting' ,meetingSchema);

module.exports = Meeting ;
