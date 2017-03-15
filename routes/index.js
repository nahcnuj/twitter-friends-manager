var Twitter = require('twitter');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.oauth) {
    res.render('index', { isLoggedIn: true });
  }
  else {
    res.render('index', { isLoggedIn: false });
  }
});

module.exports = router;
