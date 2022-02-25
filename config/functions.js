//jshint esversion:6
const Users = require("../models/user") ;
const Events =require("../models/Event") ;
const Notifications =require("../models/notifications") ;

// function speakernotificationNumbers(){
//   if
// }


speakernotificationNumbers = (req,res,next)=>{

if(req.isAuthenticated() && (req.user.isSpeaker)){

    Notifications.find({speaker_id:req.user.id} , (err , speakers) =>{
      if(!err)
      {
      res.locals.speakersnotify = speakers ;
      }else{
        console.log(err);
      }
    });


   next(); }
else
{
  console.log("Error ");
}
};


const GetUsernotification = userId => {
  let userData;
  return   Notifications.find({speaker_id:req.user.id}) ;
};

module.exports = speakernotificationNumbers ;
module.exports = GetUsernotification ;
