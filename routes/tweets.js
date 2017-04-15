var Twitter = require('twitter');
var Moment = require('moment');
var express = require('express');
var router = express.Router();

// error messages
const messageTable = {
  'Rate limit exceeded': 'Twitter API の取得制限に達しました。時間を置いて再読み込みしてください。'
};

// POST /tweets
// get a list of following users' lastest tweets
router.post('/',
  (req, res, next) => {
    let client = createClient(req.session.oauth.access_token, req.session.oauth.access_token_secret);
    client.post('users/lookup', {user_id: req.body.ids.join(',')})
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

/**
 * get a list of the logging-in user
 * @param {Twitter} client - Twitter API client
 */
function getFriends(client, cursor) {
  return client.get('friends/list', {cursor: cursor, count: 200, skip_status: true, include_user_entities: false})
    .then(result => ({
      users: result.users,
      next: result.next_cursor_str
    }))
    .catch((reason) => {
      console.error('[getFriends] ' + JSON.stringify(reason));
      throw reason;
    });
}

/**
 * get the last tweet which the specified user posted
 * @param {Twitter} client - Twitter API client
 * @param {string} screen_name - a user's screen name
 */
function getLastTweet(client, screen_name) {
  return client.get('statuses/user_timeline', {
      screen_name: screen_name,
      count: 1
    })
    .catch((reason) => {
      console.error('[getLastTweet] ' + JSON.stringify(reason));
      throw reason;
    });
}
