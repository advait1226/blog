const passport= require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys= require('./keys');
const User = require('../models/user');

passport.serializeUser((user, done)=>{
    done(null, user.id); //pass user id in done method to jam in cookie
});

passport.deserializeUser((id, done)=>{
    
    User.findById(id)
    .then((user)=>{
    done(null, user); //add user to req objbh
    });
});



passport.use(
    new GoogleStrategy({
        //options for the google strategy
        clientID: keys.google.client_id,
        clientSecret: keys.google.client_secret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done)=>{
        //passport callback function
         //check if user already exists
         User.findOne({googleId: profile.id}).then((currentUser)=>{
            if(currentUser){
                //already exists
                console.log('exists');
                done(null, currentUser); //moves on to serialize user
            } else {
                new User({
                    username:  profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.picture
                }).save()
                .then((newUser)=>{
                    console.log(newUser);
                    done(null, newUser); //moves on to serialize user
                });
            }
         })
         .catch((err)=>{
            console.log(err);
         });
        
    }
)
);