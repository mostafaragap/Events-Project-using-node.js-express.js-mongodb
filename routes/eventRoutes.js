//jshint esversion:6
const Events = require("../models/Event");
const express =require("express");
const Skills = require("../models/skills");
const User = require("../models/user");
const Notifications = require("../models/notifications");
const Meeting = require("../models/meeting");

const moment = require('moment');
moment().format();
//middleware to check if user is authenticated
const auth = require("../config/auth");

const router = express.Router();
//require validator
const { check, validationResult } = require('express-validator');
//require bodyParse
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}



const GetnumbersOfUsernotification = (uId) => {

  return  Notifications.countDocuments({sendTo:uId}) ;
};

//show users Events
//
router.get("/showMyEvents" ,isAuthenticated, (req,res)=>
{
  GetnumbersOfUsernotification(req.user.id).then(response => {
    Events.find({author : req.user.id} , (err,result)=>{
      if(!err)
      {

        res.render('event/showMyEvents' , {events :result ,numberofnotifications:response, title:"Show single Event" });
      }else{
        console.log(err);
      }
    });


});



});

//event // ID:
let eventId  ;

//add Speakers
router.post("/inviteSpeaker" , (req,res)=>{
 let eventID = req.body.eventId ;
 let eventTitle = req.body.eventTitle ;
  let eventDate = req.body.eventDate ;
 let speakerId = req.body.speakerId ;
 let skills = req.body.skillsneeded;
 console.log(req.body.action);
 if(req.body.action == "add"){
  const notification = new Notifications({
    eventId:eventID ,
    eventTitle: eventTitle  ,
    eventDate:eventDate ,
    senderId:req.user.id ,
    senderName:req.user.firstName + ' ' + req.user.lastName ,
    sendTo:speakerId ,
    type:'invite' ,
    senderImg: req.user.avatar,
    created_At: Date.now()
  });
  notification.save();
   Events.findOneAndUpdate({_id:eventID} , {$push : {speakersAdded :speakerId }}  , (err , updateduser)=>
 {
   if(!err) {

       res.redirect("/events/speakers/showSpeakers/"+skills);

   } else {

   }
 });
}else{
  Notifications.deleteOne({event_id:eventID ,sender:req.user.id ,sendTo :speakerId } , (err)=>{
    if(!err){
      console.log("notification deleted");
    }
  });

  Events.findOneAndUpdate({_id:eventID} , {$pull : {speakersAdded :speakerId }}  , (err , updateduser)=>
{
  if(!err) {

      res.redirect("/events/speakers/showSpeakers/"+skills);

  } else {

  }
});
}

});




//create new event
router.get("/create/event" ,isAuthenticated ,(req,res) =>{
  GetnumbersOfUsernotification(req.user.id).then(response => {
    Events.find({author : req.user.id} , (err,result)=>{
      if(!err)
      {
          res.render("event/create",{ errors :req.flash("errors"),numberofnotifications:response , skills:Skills,title:"Create Page"});
      }else{
        console.log(err);
      }
    });
});


});



//save createed new event
router.post("/create" ,[
check('title').isLength({ min: 5 }).withMessage("sorry title length should be more than 5 characters "),
check('description').isLength({ min: 10 }).withMessage("sorry description length should be more than 10 characters "),
check('location').isLength({ min: 3 }).withMessage("sorry location length should be more than 5 characters "),
check('date').isLength({ min: 5 }).withMessage("please add a valid date ")


] ,(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty())
  {
    req.flash("errors",errors.array());
  //  console.log(req.flash("errors"));
  res.redirect("/events/create/event");

  }else{
  const skillsNedded = req.body.skills ;


    const newEvent = new Events(
      {
      title  :req.body.title   ,
      description:req.body.description  ,
      location :req.body.location  ,
      date :req.body.date  ,
      created_At: Date.now() ,
      author:req.user.id ,
      skills:req.body.skills
      }
    ) ;
  if((req.body.skills)){
    newEvent.save((err)=>{
    if(!err)
    {
      //req.flash("info", "your Event is created succesfully");
      eventId = newEvent.id ;

      res.redirect("/events/speakers/showSpeakers/" + skillsNedded );

    //  console.log("Okkkkkkkkkk");
    }else
    {
      console.log(err);
    }
    });
  }else{
    newEvent.save((err)=>{
    if(!err)
    {
      req.flash("info", "your Event is created succesfully");
      res.redirect("/events");

      console.log("Okkkkkkkkkk");
    }else
    {
      console.log(err);
    }
    });
  }

  }

});

//edit page
router.get("/edit/:id",nocache,isAuthenticated , (req,res) =>{
  GetnumbersOfUsernotification(req.user.id).then(response => {
    Events.find({author : req.user.id} , (err,result)=>{
      if(!err)
      {
        id=req.params.id ;
        Events.findOne({_id:id} , (err , result)=>{
          if(!err){
            res.render("event/edit",{event :result,eventDate :moment(result.date).format('YYYY-MM-DD'),numberofnotifications:response ,errors :req.flash("editErrors") , title:"Edit"});
          }else{console.log(err);}
        });
      }else{
        console.log(err);
      }
    });
});


});

router.post("/update",isAuthenticated,[
check('title').isLength({ min: 5 }).withMessage("sorry title length should be more than 5 characters "),
check('description').isLength({ min: 10 }).withMessage("sorry description length should be more than 10 characters "),
check('location').isLength({ min: 3 }).withMessage("sorry location length should be more than 5 characters "),
check('date').isLength({ min: 5 }).withMessage("please add a valid date ")


],(req,res)=>{
    const errorsonedit = validationResult(req);
    if(!errorsonedit.isEmpty())
    {
      req.flash("editErrors",errorsonedit.array());

    res.redirect("/events/edit/"+req.body.eventId);

  }else
  {
    Events.update({_id:req.body.eventId} ,{title:req.body.title , description:req.body.description ,location :req.body.location  ,
    date :req.body.date  ,created_At:req.body.created_At , author:req.user.id }  ,{overWrite:true}, (err , updatedArticle)=>
  {
    if(!err){
      req.flash("info", "your Event is Edited succesfully");
      res.redirect("/events");
    }else{
      res.send(err);
    }
  });
  }


});
//edit and save

//show single event
router.get("/show/:id",nocache ,isAuthenticated, (req,res)=>
{

  GetnumbersOfUsernotification(req.user.id).then(response => {
    const id = req.params.id;
    Notifications.findOne({sendTo:req.user.id , eventId:id , type:'invite'} , (err , invite)=>{
      if(!err){
        if(invite)
        {
          Events.findOne({_id : id} , (err,result)=>{
            if(!err)
            {
              res.render('event/show' , {event :result ,numberofnotifications:response,invitedSpeaker : 'invited',notificationid:invite.id  , title:result.title });
            }else{
              console.log(err);
            }
          });
        }else
        {
          Meeting.findOne({eventId:id , speakerId:req.user.id} , (err , found)=>{
            if(!err)
            {
               if(found){
                 Events.findOne({_id : id} , (err,result)=>{
                   if(!err)
                   {
                     res.render('event/show' , {event :result ,numberofnotifications:response,meetingId:found.id,invitedSpeaker : 'allreadySpeaker'  , title:result.title });
                   }else{
                     console.log(err);
                   }
                 });
               }else
               {
                 Events.findOne({_id : id} , (err,result)=>{
                   if(!err)
                   {
                     res.render('event/show' , {event :result ,numberofnotifications:response,invitedSpeaker : 'notSpeaker'  , title:result.title });
                   }else{
                     console.log(err);
                   }
                 });
               }


            }
          });
        }
      }
    });

     // Meeting.findOne({eventId:id , speakerId:req.user.id} , (err , found)=>{
     //   if(!err)
     //   {
     //
     //       Events.findOne({_id : id} , (err,result)=>{
     //         if(!err)
     //         {
     //           res.render('event/show' , {event :result ,numberofnotifications:response,invitedSpeaker : found  , title:result.title });
     //         }else{
     //           console.log(err);
     //         }
     //       });
     //
     //   }
     // });







});


});

router.get("/delete/:id",nocache,isAuthenticated, (req,res)=>{
  GetnumbersOfUsernotification(req.user.id).then(response => {

      Events.findOne({_id :req.params.id} , (err,result)=>{
        if(!err)
        {
          res.render('event/delete' , {event :result , title:"delete" ,numberofnotifications:response });
        }else{
          console.log(err);
        }
      });
});


});

router.post("/deleteevent" , (req,res)=>{

  Events.deleteOne({_id :req.body.eventId} , (err , result)=>{
    if(!err){
      if(!(req.user.isAdmin))
      {
        req.flash("info", "your Event is deleted succesfully");
        res.redirect("/events");
      }else{
          res.redirect("/admins/adminIndex");
      }

    }else{
      console.log(err);
    }
  });
});

//add speakers

router.get("/speakers/showSpeakers/:skills?", (req,res)=>{
  GetnumbersOfUsernotification(req.user.id).then(response => {

    let skills = req.params.skills ;
    //var array = JSON.parse("[" + skills + "]");
    Events.findOne({_id:eventId} , (err,event)=>{
      if(!err)
      {
        console.log(event);
        var array = skills.split(",").map(String);

        User.find( {isSpeaker:true , skills: { $all: array } }  , (err , users)=>{
          if(!err){

        res.render("event/showSpeakers" , {speakers : users ,eventId :eventId ,numberofnotifications:response,event:event , skillsneeded:array,  title:"Speakers" } );
          }
        });
      }
    });
});




});





//route to home events
router.get("/:pageNo?",nocache, (req,res)=>
{
  let pageNo=1;
  if(req.params.pageNo){
    pageNo = parseInt(req.params.pageNo);
  }
  if(req.params.pageNo == 0)
  {
    pageNo=1;
  }
  let q= {
    skip:6*(pageNo - 1),
    limit:6
  };
  //find total docs
  let totalDocs = 0 ;
  Events.countDocuments({}, function (err, count) {
    if (err){
        console.log(err); }
        else {
      totalDocs = parseInt(count);
      Events.find({isActive:true},{},q,(err,results)=>
    {
      if(!err)
      {
      let chunk=[];
      let chunckSize = 3 ;
      for(let i=0 ; i<results.length ; i+=chunckSize){
        chunk.push(results.slice(i,chunckSize+i));
      }
      if(!(req.user)){
        res.render('event/index' , {allEvents:chunk , message : req.flash("info") , title:"Home Page" , total:parseInt(totalDocs),pageNo:pageNo});

      }else{
        GetnumbersOfUsernotification(req.user.id).then(response => {
          res.render('event/index' , {allEvents:chunk ,numberofnotifications:response, message : req.flash("info") , title:"Home Page" , total:parseInt(totalDocs),pageNo:pageNo});

        });


      }

      }else{
        console.log(err);
      }
    }).sort({created_At :-1 });
    }});

});







module.exports = router ;
