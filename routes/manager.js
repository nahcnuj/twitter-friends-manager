var Twitter = require('twitter');
var Moment = require('moment');
var express = require('express');
var router = express.Router();

// error messages
const message = {
  'Rate limit exceeded': 'Twitter API の取得制限に達しました。時間を置いて再読み込みしてください。'
};

// GET a list of the following users and their last tweets
router.get('/', function(req, res, next) {
  if (req.session.oauth) {
    let client = new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: req.session.oauth.access_token,
      access_token_secret: req.session.oauth.access_token_secret
    });

    getFriends(client)
      .then(friends => Promise.all(
        friends.map(user => getLastTweet(client, user.screen_name)
          .then(([lastTweet, ..._]) => ({
            screen_name: user.screen_name,
            name: user.name,
            profile_image_url: user.profile_image_url,
            protected: user.protected,
            description: user.description,
            following: user.following,
            last_tweet: {
              created_at: Moment(new Date(lastTweet.created_at)).format("YYYY/MM/DD HH:mm:ss [(UTC]Z[)]"),
              text: lastTweet.text
            }
          }))
        )
      ))
      .then(result => {
        res.render('manager', {data: result});
      })
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;

/**
 * get a list of the logging-in user
 * @param {Twitter} client - Twitter API client
 */
function getFriends(client) {
  return client.get('friends/list', {})
    .then(result => result.users);
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
  });
}
