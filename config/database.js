//jshint esversion:6

const mongoose = require('mongoose');
const url ="mongodb+srv://mostafa:01006092170@cluster0.w3ozq.mongodb.net/EventsDB?retryWrites=true&w=majority" ;
mongoose.connect(url,{useNewUrlParser: true},(err)=>
{
  if(err){console.log("not connected");}else{
    console.log("connected");
  }
}) ;
