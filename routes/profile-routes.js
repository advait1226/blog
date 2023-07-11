const express= require('express');
// const authController= require('../controllers/blogcontroller')
const router = express.Router();

router.use( (req, res, next) =>{
    if(!(req.user)){
        res.redirect('/');
    }
    else{next();
    }
});

router.get('/', (req, res)=>{
    res.render('profile', {user: req.user});
    // res.send(req.user.username);
});

module.exports = router;
