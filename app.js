var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session"); 
var mongoose = require('mongoose')  
const {v4:uuidv4} = require('uuid') 
const moment = require("moment")




mongoose.connect('mongodb+srv://hauntuser:9744052977@cluster0.pwwqome.mongodb.net/?retryWrites=true&w=majority')
// mongoose.connect('mongodb://localhost:27017/HAUNT')


// User Routes
var userRoutes = require('./routes/USER/index');

//Admin Routes
var adminRoutes = require('./routes/ADMIN/admin');

var app = express();

// view engine setup
app.set('views', [__dirname + '/views/USER', __dirname + '/views/ADMIN'])
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  if (!req.user) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
  }
  next();
});

app.use(session({
  secret : uuidv4(),
  resave:false,
  saveUninitialized:true,
  cookie: { maxAge: 6000000000 },
}))
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRoutes);
app.use('/', userRoutes);





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

app.listen(process.env.PORT || 3001)

module.exports = app;
