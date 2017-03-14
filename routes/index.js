var Twitter = require('twitter');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.oauth) {
    var client = new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: req.session.oauth.access_token,
      access_token_secret: req.session.oauth.access_token_secret
    });
    console.log(client);
    client.get('friends/list', {}, function(err, friends, response) {
      if (err) {
        next(err);
      }
      console.log(friends);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(friends));
    });
    //res.render('index', { isLogined: true, twitter: req.session.twitter });
  }
  else {
    res.render('index', { isLogined: false });
  }
});

module.exports = router;
