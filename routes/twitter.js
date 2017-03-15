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
    config.get('twitter.callbackURL'),
    'HMAC-SHA1'
);

router.get('/', function(req, res, next) {
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

router.get('/callback', function(req, res, next) {
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oa = req.session.oauth;
    oauth.getOAuthAccessToken(
      oa.token, oa.token_secret, oa.verifier,
      function(err, access_token, access_token_secret, results) {
        if (err) {
          res.status(403).send('something broke');
        }
        else {
          req.session.oauth.access_token = access_token;
          req.session.oauth.access_token_secret = access_token_secret;
          req.session.twitter = results;
          res.redirect('/manager');
        }
      }
    );
  }
  else {
    next(new Error("you're not supposed to be here"));
  }
});

module.exports = router;
