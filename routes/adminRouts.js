//jshint esversion:6

const express =require("express");
const router = express.Router();
const auth = require("../config/auth");
const User = require("../models/user");
const Events = require("../models/Event");
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

router.get("/adminIndex" , nocache,isAdmin,(req,res) =>{
  Events.countDocuments({} , (err , events)=>{
   if(err){console.log(err);}else{
     User.countDocuments({} , (err , users)=>{
      if(err){console.log(err);}else{
        Events.find({},(err,results)=>
      {
        if(!err)
        {
        let chunk=[];
        let chunckSize = 3 ;
        for(let i=0 ; i<results.length ; i+=chunckSize){
          chunk.push(results.slice(i,chunckSize+i));
        }
        res.render('admin/index', {
            numberOfEvents : events,
            numberOfUsers:users,
            allEvents:chunk,
            title:'Admin page'
        });
        }else{
          console.log(err);
        }
      }).sort({created_At :1 });


      }
    }) ;

   }
 }) ;
});


//view users

router.get("/viewRegistrationUsers",nocache,isAdmin , (req,res)=>{
  User.find({},(err,results)=>
{
  if(!err)
  {
  let chunk=[];
  let chunckSize = 3 ;
  for(let i=0 ; i<results.length ; i+=chunckSize){
    chunk.push(results.slice(i,chunckSize+i));
  }
    res.render('admin/viewRegistrationUsers' , {allUsers:chunk, title:"Users"});

  }else{
    console.log(err);
  }
}).sort({created_At :1 });


});



//show single user Profile
router.get("/showUserProfile/:userId",nocache,isAdmin , (req,res) =>{
  let userId = req.params.userId ;
let query = {_id:userId};
User.findOne(query,(err , user)=>{
  if(err){console.log(err);}else{
    Events.countDocuments({author:userId} , (err , result)=>{
      if(err){console.log(err);}else{
        res.render('admin/showUserProfile' , {userProfile:user,events :result, title:"View User Profile"});
      }
    });

  }
});
});

//delete user

router.delete('/delete/:id',nocache,isAdmin, (req,res)=> {

    let query = {_id: req.params.id};

 User.deleteOne(query, (err)=> {

     if(!err) {
         res.status(200).json('deleted');
     } else {
         res.status(404).json('There was an error .event was not deleted');
     }
 });
});

//block user
router.patch("/blockUser/:id",nocache,isAdmin,(req , res)=>
{
  let query ={isActive:false};
  User.update({_id:req.params.id} ,{$set : query } , (err , updateduser)=>
{
  if(!err) {
      res.status(200).json('updated');
  } else {
      res.status(404).json('There was an error .user was not updated');
  }
});
});

//unblock user
router.patch("/unblockUser/:id",nocache,isAdmin,(req , res)=>
{
  let query ={isActive:true};
  User.update({_id:req.params.id} ,{$set : query } , (err , updateduser)=>
{
  if(!err) {
      res.status(200).json('updated');
  } else {
      res.status(404).json('There was an error .user was not updated');
  }
});
});

//////////////////////Events functions///////////////////////
//view Events

router.get("/viewcreatedEvents",nocache,isAdmin , (req,res)=>{
  Events.find({},(err,results)=>
{
  if(!err)
  {

    res.render('admin/viewcreatedEvents' , {allEvents:results, title:"All Events"});

  }else{
    console.log(err);
  }
}).sort({created_At :1 });
});



//show single Event
router.get("/showEvent/:eventId" ,nocache ,isAdmin , (req,res)=>{
  let eventId = req.params.eventId ;
let query = { _id:eventId };
Events.findOne(query , (err , singleEvent)=>{
  if(!err){
    let eventauthor = singleEvent.author ;
    console.log(eventauthor);
    User.findOne({_id:eventauthor} , (err , user) =>{
      if(!err){
        res.render('admin/showEvent' , {event:singleEvent,userinfo : user , title:"View Event"});
      }else{console.log(err);}
    });

  }else{
    console.log(err);
  }
});

});


//delete Event

// router.delete('/delete/:id',isAdmin, (req,res)=> {
//
//     let query = {_id: req.params.id};
//
//  User.deleteOne(query, (err)=> {
//
//      if(!err) {
//          res.status(200).json('deleted');
//      } else {
//          res.status(404).json('There was an error .event was not deleted');
//      }
//  });
// });
//
// hide Event
router.patch("/hideEvent/:id",isAdmin,(req , res)=>
{
  let query ={isActive:false};
  Events.update({_id:req.params.id} ,{$set : query } , (err , updateduser)=>
{
  if(!err) {
      res.status(200).json('updated');
  } else {
      res.status(404).json('There was an error .user was not updated');
  }
});
});


//unhide Event

router.patch("/unhideEvent/:id",isAdmin,(req , res)=>
{
  let query ={isActive:true};
  Events.update({_id:req.params.id} ,{$set : query } , (err , updateduser)=>
{
  if(!err) {
      res.status(200).json('updated');
  } else {
      res.status(404).json('There was an error .user was not updated');
  }
});
});
//
// //unblock user
// router.patch("/unblockUser/:id",isAdmin,(req , res)=>
// {
//   let query ={isActive:true};
//   User.update({_id:req.params.id} ,{$set : query } , (err , updateduser)=>
// {
//   if(!err) {
//       res.status(200).json('updated');
//   } else {
//       res.status(404).json('There was an error .user was not updated');
//   }
// });
// });






module.exports = router ;
