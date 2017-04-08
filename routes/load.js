var Twitter = require('twitter');
var Moment = require('moment');
var express = require('express');
var cookie = require('react-cookie');
var router = express.Router();

// error messages
const message = {
  'Rate limit exceeded': 'Twitter API の取得制限に達しました。時間を置いて再読み込みしてください。'
};

// GET /load/delay?screen_name=
// delay time between requests of friends' data
router.get('/delay', function(req, res, next) {
  if (!req.query || !req.query.token || !req.query.secret) {
    next(); // todo: redirect error page
    return;
  }
  let client = createClient(req.query.token, req.query.secret);
  getNumberOfFriends(client)
    .then(number => {
      res.contentType('text/plain');
      res.send('' + number);
    })
    .catch(reason => {
      // todo: redirect error page
      console.error('[getNumberOfFriends] ' + reason);
      res.redirect('/');
    });
});

// GET /load?cursor=
// a list of the following users and their last tweets
router.get('/', function(req, res, next) {
  let client = createClient(req.query.token, req.query.secret);

  getFriends(client, req.query.cursor, req.query.needDelay)
    .then(({users: friends, next_cursor: nextCursor}) => Promise.all([
      Promise.all(
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
          .catch((reason) => {
            console.error('[getLastTweet] ' + reason);
          })
      )),
      nextCursor
    ]))
    .then(([friendsData, nextCursor]) => {
      res.contentType('application/json');
      res.json({
        data: friendsData,
        next: nextCursor
      });
    })
    .catch(reason => {
      // todo: redirect error page
      const unplug = cookie.plugToRequest(req, res);
      cookie.remove('oauth', {path: '/'});
      unplug();
      res.redirect('/');
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
 * 
 * @param {Twitter} client 
 */
function getNumberOfFriends(client) {
  return client.get('account/settings', {})
    .then(({screen_name: screenName}) => client.get('users/lookup', {screen_name: screenName}))
    .then(([user, ..._]) => user.friends_count)
    .catch((reason) => {
      console.error(reason);
      throw reason;
    });
}

/**
 * get a list of the logging-in user
 * @param {Twitter} client - Twitter API client
 */
function getFriends(client, cursor, needDelay) {
  return client.get('friends/list', {cursor: cursor, count: needDelay ? 60 : 200})
    .then(result => ({
      users: result.users,
      next_cursor: result.next_cursor
    }))
    .catch((reason) => {
      console.error('[getFriends] ' + reason);
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
      console.error('[getLastTweet] ' + reason);
      throw reason;
    });
}
