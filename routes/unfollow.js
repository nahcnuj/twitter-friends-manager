var Twitter = require('twitter');
var express = require('express');
var router = express.Router();

// error message
var message = {
  'Rate limit exceeded': 'Twitter API の取得制限に達しました。時間を置いて再読み込みしてください。'
};

/* POST unfollow */
router.post('/', function(req, res, next) {
  if (req.session.oauth) {
    var client = new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: req.session.oauth.access_token,
      access_token_secret: req.session.oauth.access_token_secret
    });

    console.log(req.body);

    Promise.resolve()
      .then(() => unfollow(client, req.body.screen_name))
      .then(() => {
        res.redirect('/manager');
      })
      .catch(reason => {
        res.render('manager', {message: 'Error', reason: reason[0].message});
        console.error(reason);
      });
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;

function unfollow(client, screen_name) {
  return new Promise((resolve, reject) =>
    client.post(
      'friendships/destroy',
      { screen_name: screen_name },
      (err, params, _) => {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      }
    ));
}
