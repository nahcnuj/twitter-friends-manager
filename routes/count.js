var Twitter = require('twitter');
var express = require('express');
var router = express.Router();

// error messages
const messageTable = {
  'Rate limit exceeded': 'Twitter API の取得制限に達しました。時間を置いて再読み込みしてください。'
};

// GET /count/following
// get a number of following users
router.get('/following',
  (req, res, next) => {
    let client = createClient(req.session.oauth.access_token, req.session.oauth.access_token_secret);

    client.get('account/settings', {})
      .then(({screen_name: screenName}) => client.get('users/lookup', {screen_name: screenName}))
      .then(([user, ..._]) => user.friends_count)
      .then((count) => res.send('' + count))
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
