var twitter = require('twitter');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.oauth) {
    res.render('index', { isLogined: true });
  }
  else {
    res.render('index', { isLogined: false });
  }
});

module.exports = router;
