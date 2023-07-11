const express= require('express');
// const authController= require('../controllers/blogcontroller')
const router = express.Router();
const passport = require('passport'); 
//auth login

router.get('/login', (req, res)=>{
    res.render('login',{user: req.user});
});

//logout
router.get('/logout', (req, res)=>{
    req.logout((result)=>{
    res.redirect('/');

    })
});

// auth with google

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));// bring up consent screen


//callback route for google
 router.get('/google/redirect', passport.authenticate('google'), (req,res)=>{
    // res.send(req.user);
    res.redirect('/profile');
 }) //sees code requests info fires passport callbackn

module.exports = router;
