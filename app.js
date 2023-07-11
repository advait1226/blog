const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogroutes');
const authRoutes = require('./routes/auth-routes');
const profileRoutes= require('./routes/profile-routes');

const passportSetup= require('./config/passport-setup');
const keys= require('./config/keys');
const cookieSession= require('cookie-session');
const passport= require('passport');

//express app
const app = express();

//connect to mongodb //listen for requests
mongoose.connect(keys.mongoDB.dbURl, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=> {
    console.log('connected to mongodb');
    app.listen(3000, ()=>{
        console.log('app now listening for requests on port 3000')
    });
    
})
.catch((err)=> console.log(err) );


//register view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//session cookie set up
app.use(cookieSession({ //encrypts cookie
    maxAge: 24*60*60*1000 , //milisecd for a day
    keys: [keys.session.cookieKey]
}));

// register regenerate & save after the cookieSession middleware initialization
//req.session.regenerate in v 0.5.3 but not in 0.6.0 so error that req.session.regenerate not a function
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => {
            cb();
        }
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => {
            cb();
        }
    }
    next();
});

//initialize passport
app.use(passport.initialize());
    app.use(passport.session()); // session cookies while login


//middleware and static files 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true})); //decodes info encoded in url ad passes into an object we can access from request object else undefined
app.use(morgan('dev')); 





//basic routes

app.get('/', (req, res) =>{
    res.render('home', { user: req.user});
});
   // res.send('<p>petaa</p>');    //automatically sets content header and status code
    // res.sendFile('./views/index.html', {root : __dirname});  //specify path relative tio 
// or use path module
 app.get('/about', (req, res) =>{
res.render('about', {title : 'About'});
});

//auth routes
app.use('/auth', authRoutes);

//profile routes
app.use('/profile', profileRoutes);


//blog routes
app.use('/blogs', blogRoutes);

app.use((req, res) =>{
    res.status(404).render('404', {title : 'About'});
 }); //middleware use if not used anything else always at the end

