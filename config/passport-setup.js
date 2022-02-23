//jshint esversion:6
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user") ;
//saving user object in the session

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

//sign Up
passport.use('local.signup', new localStrategy({
    usernameField : 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req,username,password, done)=> {
    if (req.body.password != req.body.confirmPassword) {
        return done(null, false, req.flash('error', 'Passwords do not match'));
    }else if(req.body.password.length < 6 || req.body.firstName < 4 || req.body.email.length < 5 ||req.body.city.length < 3 )

    {
        return done(null, false, req.flash('error', 'Please add a valid data'));
    }

     else {
        User.findOne({email: username}, (err,user)=> {
            if(err) {
                return done(err);
            }
          else  if(user) {
                return done(null, false, req.flash('error', 'Email already used'));
            }

            if (!user && req.body.typeSelect === 'Publisher') {
                //create user
                let newUser = new User();
                newUser.firstName = req.body.firstName;
                      newUser.lastName =req.body.lastName ;
                      newUser.email=req.body.email ;
                      newUser.city= req.body.city  ;
                      newUser.password= newUser.hashPassword(req.body.password);
                      newUser.avatar='profile.png';
                      newUser.isAdmin = false ;
                      newUser.created_At = Date.now() ;
                      newUser.isActive= true ;
                      newUser.isSpeaker= false ;

                newUser.save ((err,user)=> {
                    if(!err) {
                        return done(null, user, req.flash('success', 'User Added'));
                    } else {
                        console.log(err);
                    }
                });
            }else{
              let newUser = new User();
              newUser.firstName = req.body.firstName;
                    newUser.lastName =req.body.lastName ;
                    newUser.email=req.body.email ;
                    newUser.city= req.body.city  ;
                    newUser.password= newUser.hashPassword(req.body.password);
                    newUser.avatar='profile.png';
                    newUser.isAdmin = false ;
                    newUser.created_At = Date.now() ;
                    newUser.isActive= true ;
                    newUser.isSpeaker= true ;

              newUser.save ((err,user)=> {
                  if(!err) {
                      return done(null, user, req.flash('success', 'User Added'));
                  } else {
                      console.log(err);
                  }
              });
            }
        });
    }
}));


//login
passport.use('local.login' , new localStrategy({
  usernameField : 'email',
  passwordField: 'password',
  passReqToCallback: true
} , (req,username,password,done)=>{
  User.findOne({email : username}, (err , user)=>{
    if(err)
    {
        return done(null, false, req.flash('error', 'Somthing wrong happend please try again'));
    }if(!user)
    {
        return done(null, false, req.flash('error', ' Sorry, we can not find an account with this email address. please try again'));
    }if(user )
    {
      if (!user.comparePasswords(password , user.password)){
        return done(null , false , req.flash('error' , 'username or Password is wrong , please try again'));

      }else if(user.isActive === false) {
          return done(null , false , req.flash('error' , 'Sorry you are blocked please contact admin'));


      }else  {
        return done(null , user);
      }
    }
  });
}));
