var express = require('express');
var config = require('config');
var OAuth = require('oauth').OAuth;
var router = express.Router();

var oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.CONSUMER_KEY,
    process.env.CONSUMER_SECRET,
    '1.0A',
    config.get('callbackURL'),
    'HMAC-SHA1'
);

router.get('/', function(req, res, next) {
  console.log(process.env.NODE_ENV);
  console.log(config);
  oauth.getOAuthRequestToken(function(err, token, secret, results) {
    if (err) {
      console.error(err);
      res.send("Didn't work.");
    }
    else {
      req.session.oauth = {
        token: token,
        token_secret: secret
      };
      req.session.save(function(){});
      res.redirect(`https://twitter.com/oauth/authenticate?oauth_token=${token}`);
    }
  })
});

module.exports = router;
