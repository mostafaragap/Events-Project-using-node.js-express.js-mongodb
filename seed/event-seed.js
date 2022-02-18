//jshint esversion:6

const db = require('../config/database');

const Events = require('../models/Event') ;

let today = new Date();
let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
   today.toLocaleString("en-US", options) ;
let newEvents=[
new Events({
  title:'beach cleaning system',
  description:"Lorem ipsum dolor sit amet, consectetur adipisicin Lorem ipsum dolor sit amet, consectetur adipisicin",
  location:'Cairo' ,
  date:Date.now() ,
  created_At : Date.now(),
  author:"62092027e69aab707dee915c"
}),
new Events({
  title:'mostafa ragap system',
  description:"Lorem ipsum dolor sit amet, consectetur adipisicin Lorem ipsum dolor sit amet, consectetur adipisicin",
  location:'alex' ,
  date:Date.now() ,
  created_At : Date.now(),
  author:"62092027e69aab707dee915c"
}),
new Events({
  title:'ahmed system ',
  description:"Lorem ipsum dolor sit amet, consectetur adipisicin Lorem ipsum dolor sit amet, consectetur adipisicin",
  location:'sur' ,
  date:Date.now() ,
  created_At : Date.now(),
  author:"62092027e69aab707dee915c"
}),
new Events({
  title:'alaa system',
  description:"Lorem ipsum dolor sit amet, consectetur adipisicin Lorem ipsum dolor sit amet, consectetur adipisicin",
  location:'Cairo' ,
  date:Date.now() ,
  created_At : Date.now(),
  author:"62092027e69aab707dee915c"
}),
new Events({
  title:'Adel system',
  description:"Lorem ipsum dolor sit amet, consectetur adipisicin Lorem ipsum dolor sit amet, consectetur adipisicin",
  location:'alex' ,
  date:Date.now() ,
  created_At : Date.now(),
  author:"62092027e69aab707dee915c"
}),
new Events({
  title:'sophy system',
  description:"Lorem ipsum dolor sit amet, consectetur adipisicin Lorem ipsum dolor sit amet, consectetur adipisicin",
  location:'Cairo' ,
  date:Date.now() ,
  created_At : Date.now(),
  author:"62092027e69aab707dee915c"
}),
new Events({
  title:'Khaled Driver',
  description:"Lorem ipsum dolor sit amet, consectetur adipisicin Lorem ipsum dolor sit amet, consectetur adipisicin",
  location:'alex' ,
  date:Date.now() ,
  created_At : Date.now(),
  author:"62092027e69aab707dee915c"
}),
new Events({
  title:'Hossam cleaning system',
  description:"Lorem ipsum dolor sit amet, consectetur adipisicinLorem ipsum dolor sit amet, consectetur adipisicin",
  location:'Cairo' ,
  date:Date.now() ,
  created_At : Date.now(),
  author:"62092027e69aab707dee915c"
}),
new Events({
  title:'Omar cleaning system',
  description:"Lorem ipsum dolor sit amet, consectetur adipisicin Lorem ipsum dolor sit amet, consectetur adipisicin",
  location:'alex' ,
  date:Date.now() ,
  created_At : Date.now(),
  author:"62092027e69aab707dee915c"
}),

];


newEvents.forEach((event) => {
  event.save((err)=>
{
  if(err){
    console.log(err);
  }
});
});


// let post = new Events({
//   title:'beach cleaning system',
//   description:"Lorem ipsum dolor sit amet, consectetur adipisicin",
//   location:'Cairo' ,
//   date:today.toLocaleString("en-US", options) ,
//   created_At : today.toLocaleString("en-US", options)
// });
//
// post.save();


// let newevent = new Events({
//   title: "mostafa" ,
//   description:"mostafa test date" ,
//   location:"Egypt - cairo",
//   date : Date.now()
// });

// let newevent2 = new Events({
//   title: "Ahmed" ,
//   description:"Ahmed test date" ,
//   location:"Egypt - cairo",
//   date : Date.now()
// });

// newevent.save((err)=>
// {
//   if(err){console.log(err);}
//   else{
//     console.log("saved To database");
//   }
// });
// newevent2.save((err)=>
// {
//   if(err){console.log(err);}
//   else{
//     console.log("saved To database");
//   }
// });
