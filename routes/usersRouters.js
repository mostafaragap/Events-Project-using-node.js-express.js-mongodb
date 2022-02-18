//jshint esversion:6

const express =require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require('passport');
const multer  = require('multer');

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}
//config multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '.png';
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });
//middleware to check if user is authenticated
const auth = require("../config/auth");
const Events = require("../models/Event");

//require bodyParse
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));

//login
router.get("/login",nocache , (req,res) =>{
  res.render("user/login" , {error : req.flash('error')   ,title:"Sign In"});

});

// router.post('/login',
//   passport.authenticate('local.login', {
//
//       failureRedirect: '/users/login',
//       failureFlash: true })
//     );


    router.post('/login',
  passport.authenticate('local.login', { failureRedirect: '/users/login', failureMessage: true }),
  function(req, res) {
    if(!(req.user.isAdmin))
    {
      res.redirect("/events/1");
    }else{
    res.redirect("/admins/adminIndex");
    }

  });


//sign Up

router.get("/signUp" ,nocache, (req,res) =>{

  res.render("user/signUp" , {error : req.flash('error'),title:"Sign Up"});
});

router.post('/signUp',
  passport.authenticate('local.signup', {
    successRedirect: '/users/profile',
      failureRedirect: '/users/signup',
      failureFlash: true })
    );

// progile
router.get('/profile',nocache,isAuthenticated ,(req,res)=> {
Events.countDocuments({author:req.user.id} , (err , result)=>{
  if(err){console.log(err);}else{
    res.render('user/profile', {
        events : result,
        title:req.user.firstName +' ' + req.user.lastName
    });
  }
});



});

//upload user uploadAvatar
router.post("/uploadAvatar" , upload.single('avatar') , (req,res)=>{
let newfields={
  avatar:req.file.filename
};
User.updateOne({_id:req.user.id} ,newfields , (err)=>{
  if(!err)
  {
    res.redirect('/users/profile');
  }
} );
});


//logOut

router.get('/logout',nocache, function(req, res, next) {
  req.user = null ;
  req.logout();
  res.redirect('/users/login');
});


//get edit profile page

router.get('/editProfile',nocache, function(req, res, next) {
res.render('user/editProfile' , {title:"Edit My Profile info"});
});

router.post('/editProfile', function(req, res, next) {
let userid=req.user.id ;
if(!(req.user.isAdmin))
{
  User.updateOne({_id : userid} ,{firstName:req.body.firstName , lastName:req.body.lastName , email:req.body.email , city:req.body.city , isAdmin:false}, (err)=>{
    if(!err){res.redirect('/users/profile');}else{console.log(err);}
  } );
}else
{
  User.updateOne({_id : userid} ,{firstName:req.body.firstName , lastName:req.body.lastName , email:req.body.email , city:req.body.city , isAdmin:true}, (err)=>{
    if(!err){
      res.redirect('/admins/adminIndex');
    }else{
      console.log(err);
    }
  } );
}

});



module.exports = router ;
