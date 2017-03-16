var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var OAuth = require('oauth').OAuth;

var index = require('./routes/index');
var twitter = require('./routes/twitter');
var manager = require('./routes/manager');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000  // 30 min
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

// bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));

// jquery
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));

// bootstrap-social
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-social'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-social/assets/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap-social/assets/fonts'));

// routes
app.use('/', index);
app.use('/auth/twitter', twitter)
app.use('/manager', manager);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
