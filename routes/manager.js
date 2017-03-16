var Twitter = require('twitter');
var Moment = require('moment');
var express = require('express');
var router = express.Router();

// error message
var message = {
  'Rate limit exceeded': 'Twitter API の取得制限に達しました。時間を置いて再読み込みしてください。'
};

// GET a list of the following users
router.get('/', function(req, res, next) {
  if (req.session.oauth) {
    var client = new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: req.session.oauth.access_token,
      access_token_secret: req.session.oauth.access_token_secret
    });

    Promise.resolve()
      .then(() => getFriends(client))
      .then(friends => Promise.all( friends.map(friend => getData(client, friend)) ))
      .then(result => {
        res.render('manager', {data: result})
      })
      .catch(reason => {
        res.render('manager', {message: message[reason[0].message], reason: reason[0].message});
        console.error(reason);
      });
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;

// create a pair object of a friend and their last tweet
function getData(client, friend) {
  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => getLastTweet(client, friend))
      .then(tweet => { resolve({ account: friend, last_tweet: tweet }) })
      .catch(reason => reject(reason));
  });
}

// get a list of following users
function getFriends(client) {
  return new Promise((resolve, reject) =>
    client.get(
      'friends/list',
      { count: 200 },
      (err, friends, _) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(friends.users.map(user => ({
            screen_name: user.screen_name,
            name: user.name,
            profile_image_url: user.profile_image_url,
            protected: user.protected,
            description: user.description,
            following: user.following
          })));
        }
      }
    ));
}

// get a last tweet who the following user posted
function getLastTweet(client, friend) {
  return new Promise((resolve, reject) =>
    client.get(
      'statuses/user_timeline',
      { screen_name: friend.screen_name, count: 1 },
      (err, tweets, _) => {
        if (err) {
          reject(err);
        }
        else {
          var tweet = tweets[0];
          var moment = Moment(new Date(tweet.created_at)).format('YYYY/MM/DD HH:MM:ss Z');
          resolve({
            text: tweet.text,
            created_at: moment
          });
        }
      }
    ));
}
