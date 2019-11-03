 var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var apikey = require('./config/apikey');
// AUTHENTICATION MODULES
session = require("express-session"),
bodyParser = require("body-parser"),
User = require( './models/User' ),
flash = require('connect-flash')
// END OF AUTHENTICATION MODULES

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/local' , {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
});

const furnitureController = require('./controllers/furnitureController')
const swatchController = require('./controllers/swatchController')
const profileController = require('./controllers/profileController')


// Authentication
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)



var app = express();

app.use(function(req,res,next){
    console.log("about to make some routes")
    next()
});

/*************************************************************************
     HERE ARE THE AUTHENTICATION ROUTES
**************************************************************************/

app.use(session({ secret: 'zzbbyanana' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));



const approvedLogins = ["luyaopei@brandeis.edu"];

// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.title="Furniture"
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    if (req.user.googleemail.endsWith("@brandeis.edu") ||
          req.user.googleemail.endsWith("@gmail.com"))
          {
            console.log("user has been Authenticated")
            res.locals.user = req.user
            res.locals.loggedIn = true
          }

    else {
      res.locals.loggedIn = false
    }
    console.log('req.user = ')
    console.dir(req.user)
    // here is where we can handle whitelisted logins ...
    if (req.user){
      if (req.user.googleemail=='luyaopei@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'owner'
      }else {
        console.log('User has logged in')
        res.locals.status = 'user'
      }
    }
  }
  next()
})



// here are the authentication routes

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/notyet', function(req,res){
  res.render('notyet',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})



// route for logging out
app.get('/logout', function(req, res) {
        req.session.destroy((error)=>{console.log("Error in destroying session: "+error)});
        console.log("session has been destroyed")
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        })
      );


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.loggedIn = true
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

function isOwner(req, res, next) {
  if (req.user){
    if (req.user.googleemail=='luyaopei@brandeis.edu'){
      console.log("Owner has logged in")
      res.locals.status = 'owner'
      res.locals.ownership = true
    }else {
      console.log('User has logged in')
      res.locals.status = 'user'
      res.locals.ownership = false
    }
  }
}

// we require them to be logged in to see their profile
app.get('/profile', isLoggedIn,  function(req, res) {
        res.render('profile')/*, {
            user : req.user // get the user out of session and pass to template
        });*/
    });

app.get('/editProfile',isLoggedIn, isOwner,(req,res)=>{
    res.render('editProfile')
})

app.get('/profiles', isLoggedIn,  profileController.getAllProfiles);
app.get('/showProfile/:id', isLoggedIn,  profileController.getOneProfile);



app.post('/updateProfile',profileController.update)


// END OF THE AUTHENTICATION ROUTES

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/', function(req, res, next) {
  res.render('index',{title:"FurnitureFriend"});
});

app.get('/furnitureSearch', function(req, res, next) {
  res.render('furnitureSearch');
});

app.get('/furnitureEnter', function(req, res, next) {
  res.render('furnitureEnter');
});

app.get('/postresult', function(req, res, next) {
  console.dir(req.body)
  res.render('postresult',{title:"Form Data", Type:req.body.Type, Width:req.body.Width, Length:req.body.Length});
});

app.get('/postresult', function(req, res, next) {
  console.dir(req.body)
  res.render('postresult',{title:"Form Data", Type:req.body.Type, Width:req.body.Width, Length:req.body.Length});
});

app.get('/chairForm', function(req, res, next) {
  console.dir(req.body)
  res.render('chairForm',{title:"Form Data", chairl:req.body.chairl, chairw:req.body.chairw, tablew:req.body.tablew, tablel: req.body.tablel});
});

app.post('/sendVal', function(req, res, next) {
  console.dir(req.body)
  res.render('visual',{title:"Form Data", chairl:req.body.chairl, chairw:req.body.chairw, tablew:req.body.tablew, tablel: req.body.tablel});
});

app.use(function(req,res,next){
    console.log("about to processform")
    next()
});
app.post('/processform',furnitureController.saveFurniture)

app.get('/swatchPlaza', swatchController.getAllSwatch)

app.get('/swatchPlaza', swatchController.getAllSwatch)

app.get('/swatchPlaza/:id', swatchController.getOneSwatch)

app.get('/furnitureStorage', furnitureController.getAllFurniture)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
