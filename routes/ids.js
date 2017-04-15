var Twitter = require('twitter');
var express = require('express');
var router = express.Router();

// error messages
const messageTable = {
  'Rate limit exceeded': 'Twitter API の取得制限に達しました。時間を置いて再読み込みしてください。'
};

// GET /ids/following
// get a list of following users' ids
router.get('/following',
  (req, res, next) => {
    let client = createClient(req.session.oauth.access_token, req.session.oauth.access_token_secret);

    client.get('friends/ids', {cursor: req.query.next_cursor_str, count: 5000, stringify_ids: true})
      .then((response) => {
          res.send(response);
        })
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
