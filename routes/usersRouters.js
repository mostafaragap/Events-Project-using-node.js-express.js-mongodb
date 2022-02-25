//jshint esversion:6

const express =require("express");
const router = express.Router();
const User = require("../models/user");
const Skills = require("../models/skills");
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
const functions = require("../config/functions");


const Events = require("../models/Event");
const Notifications = require("../models/notifications");
 const Meeting = require("../models/meeting");
//require bodyParse
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));

//login
router.get("/login",nocache , (req,res) =>{

  res.render("user/login" , {error : req.flash('error')   ,title:"Sign In"});

});
 //function to get numbers of user Notifications
 const GetnumbersOfUsernotification = (uId) => {

   return  Notifications.countDocuments({sendTo:uId}) ;
 };


//login submit
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
  const typeArray = ["Publisher" , "Speaker"] ;
  res.render("user/signUp" , {error : req.flash('error'), type:typeArray ,title:"Sign Up"});
});

router.post('/signUp',
  passport.authenticate('local.signup', {

      failureRedirect: '/users/signup',
      failureFlash: true }) , (req,res)=>{

          res.redirect('/events/1') ;
      }
    );




// profile
router.get('/profile',nocache,isAuthenticated ,(req,res)=> {
  let user_skills = req.user.skills ;
  var elmts = Skills.filter(f => !user_skills.includes(f));

  GetnumbersOfUsernotification(req.user.id).then(response => {

    Events.countDocuments({author:req.user.id} , (err , result)=>{
      if(err){console.log(err);}else{
        if((req.user.isSpeaker)){
          res.render('user/profile', {
              events : result,
              title:req.user.firstName +' ' + req.user.lastName ,
              skills:elmts ,
              exist : req.flash("exist"),
              numberofnotifications:response

          });
        }else
        res.render('user/profile', {
            events : result,
            title:req.user.firstName +' ' + req.user.lastName,
            numberofnotifications:response

        });
      }
    });

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

  GetnumbersOfUsernotification(req.user.id).then(response => {

      res.render('user/editProfile'  ,{title:"Edit My Profile info" ,numberofnotifications:response });


});



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

router.patch('/addSkill/:skill' , (req,res)=>{
  const skill = req.params.skill;
  let userid=req.user.id ;
  let userSkills = req.user.skills ;
  if(!(userSkills.includes(skill))){
    User.updateOne({_id:userid} , {$push : {skills :skill }}  , (err , updateduser)=>
  {
    if(!err) {
        res.status(200).json('updated');
    } else {
        res.status(404).json('There was an error .user was not updated');
    }
  });
}else{
req.flash("exist", "sorry you can not add this twice");
  res.status(200).json('Exist skill');
}


});

//delete skills



router.patch('/deleteSkill/:skillName' , (req,res)=>{
  const skill = req.params.skillName;
  let userid=req.user.id ;
  let userSkills = req.user.skills ;

    User.updateOne({_id:userid} , {$pull : {skills :skill }}  , (err , updateduser)=>
  {
    if(!err) {
        res.status(200).json('updated');
    } else {
        res.status(404).json('There was an error .user was not updated');
    }
  });

});

//get notification page
router.get('/notifications' ,nocache, (req,res,next)=>{

  GetnumbersOfUsernotification(req.user.id).then(response => {

   Notifications.find({sendTo:req.user.id , type:'invite'} , (err , results) =>{
res.render("user/notificationsPage" , {notifications:results ,numberofnotifications:response , title:"notifications" });

   });


});
});

//view Profile
router.get("/userProfile/:userId",nocache,isAuthenticated, (req,res) =>{
  GetnumbersOfUsernotification(req.user.id).then(response => {

   Notifications.find({sendTo:req.user.id} , (err , results) =>{
     let userId = req.params.userId ;
     let query = {_id:userId};
     User.findOne(query,(err , user)=>{
     if(err){console.log(err);}else{
       Events.countDocuments({author:userId} , (err , result)=>{
         if(err){console.log(err);}else{
           res.render('user/userProfile' , {userProfile:user,events :result, title:"View User Profile" ,numberofnotifications:response });
         }
       });

     }
     });

   });

});

});



//speaker Action

router.post('/speakersAction' , (req,res) =>{

 if(req.body.accept)
 {
   Notifications.findOneAndUpdate({id:req.body.accept} , {type:"confirmed"} ,(err , result)=>{
     if(!(err))
     {
       const accept = new Meeting({
         author:req.body.author ,
         eventId:req.body.eventId,
         speakerId:req.user.id ,
         created_At:Date.now()
       });
       accept.save();
       res.redirect("/users/notificationsPage");
     }
   });

 }else{
  Notifications.findOneAndUpdate({id:req.body.discard} , {type:"discard"} ,(err ,result )=>{
if(!err){
  console.log('siscarded');
}

  });
 }



});





module.exports = router ;
