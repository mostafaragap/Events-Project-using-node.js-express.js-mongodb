//jshint esversion:6
isAuthenticated = (req,res,next)=>{
if(req.isAuthenticated()){ return next(); }
else
{
  res.redirect("/users/login");
}
};



isAdmin = (req,res,next)=>{
if(req.isAuthenticated() && (req.user.isAdmin)){ return next(); }
else
{

  res.redirect("/events/1");
}
};




module.exports = isAdmin ;
module.exports = isAuthenticated ;
