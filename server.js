var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var reactCookie = require('react-cookie');
var session = require('express-session');

const app = express();

app.set('port', (process.env.PORT || 3000));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000  // 30 min
  }
}));

app.use('/', express.static(__dirname));

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
const index = require('./routes/index');
const twitter = require('./routes/twitter');
const load = require('./routes/load');

app.use('/', index);
app.use('/auth/twitter', twitter);
app.use('/load', load);

app.listen(app.get('port'),
    () => {
        console.log('Server started at http://localhost:' + app.get('port'));
    });

module.exports = app;
