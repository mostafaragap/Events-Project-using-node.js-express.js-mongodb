//jshint esversion:6

const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema(
  {
  title : {
    type:String ,
    required: true
  } ,
  description : {
    type:String ,
    required: true
  } ,
   location:{
     type:String ,
     required: true
   } ,
   date:{
     type:Date ,
     required: true

   },
   created_At:{
     type:Date ,
     required: true
   },
   author : String,
   isActive:{
     type:Boolean ,
     default:true
   },
   skills:{
     type:[String] ,
     default:[]
   } ,
   speakersAdded:
   {
     type:[String],
     default:[]
   }
 }
);

let Event = mongoose.model('Event' ,eventSchema);

module.exports = Event ;
