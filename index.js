'use strict';

const //http = require('http'),
    fs = require('fs'),
    ejs = require('ejs'),
    //qs = require('qs'),
    express = require('express'),
    OAuth = require('oauth').OAuth;
const settings = require('./settings');
const port = process.env.port || settings.port;
const template = fs.readFileSync(`${__dirname}/public_html/index.ejs`, 'utf-8');
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;

const app = express();
app.configure(function(){
    app.use(express.session());
});
app.listen(port);

console.log(`Server running at port ${port}`);

const oa = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.CONSUMER_KEY,
    process.env.CONSUMER_SECRET,
    '1.0A',
    `http://followmgr.azurewebsites.net/auth/twitter/callback`,
    'HMAC-SHA1'
);

app.get('/auth/twitter', function(request, result) {
    oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, _) {
        if (error) {
            console.error(error);
            result.send("Didn't work.");
        }
        else {
            request.session.oauth = {};
            request.session.oauth.token = oauth_token;
            request.session.oauth.token_secret = oauth_token_secret;
            console.debug(`oauth.token: ${request.session.oauth.token}`);
            console.debug(`oauth.token: ${request.session.oauth.token_secret}`);
            result.redirect(`https://twitter.com/oauth/authenticate?oauth_token=${oauth_token}`);
        }
    })
})

/*
app.get('/', function(request, result) {
    var data = ejs.render(template, {});
    result.writeHead(200, {'Content-Type': 'text/html'});
    result.write(data);
    //result.write(JSON.stringify(process.env));
    result.end();
});
*/
