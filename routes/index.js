var Twitter = require('twitter');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.oauth) {
    res.redirect('/manager');
  }
  else {
    res.render('index');
  }
});

module.exports = router;
