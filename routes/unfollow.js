var Twitter = require('twitter');
var express = require('express');
var router = express.Router();

// error messages
const messageTable = {
  'Rate limit exceeded': 'Twitter API の取得制限に達しました。時間を置いて再読み込みしてください。'
};

// POST /unfollow
// unfollow
router.post('/',
  (req, res, next) => {
    let client = createClient(req.session.oauth.access_token, req.session.oauth.access_token_secret);

    client.post('friendships/destroy', {screen_name: req.body.screen_name})
      .then((result) => res.send(result))
      .catch(([reason]) => {
          res.status(500);
          if (reason.message in messageTable) {
            res.send(messageTable[reason.message]);
          }
          else {
            res.send(reason.message);
          }
        });
  });

module.exports = router;

function createClient(accessToken, accessTokenSecret) {
  return new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret
  });
}
