//jshint esversion:6
const express = require("express");
const app=express();

//connect to mongodb
const db = require('./config/database');
const Notifications = require("./models/notifications");

///session and flash
const session = require('express-session');
 const flash = require('connect-flash');
 //passport
 const passport=require('passport');
 const passportSetup=require('./config/passport-setup');
//bring ejs
app.set('view engine' , 'ejs');
//bring static folders
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('node_modules'));

///session and flash config
app.use(session({
  secret: 'mostafa ragap',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
//bring passport
app.use(passport.initialize());
app.use(passport.session());
//store user object
app.get('*' , (req,res,next) =>{
  res.locals.user = req.user || null;
  next();
});
app.get("/", (req,res)=>
{
  res.redirect("/events");
});




//bring events routes
const events = require('./routes/eventRoutes');
app.use('/events' , events);


//bring useres routes
const users = require('./routes/usersRouters');
app.use('/users' , users);

//bring admin routes
const admin = require('./routes/adminRouts');
app.use('/admins' , admin);


app.listen(3000 , ()=>
{
  console.log("app is working in port 3000");
});
