'use strict';

const //http = require('http'),
    fs = require('fs'),
    ejs = require('ejs'),
    //qs = require('qs'),
    express = require('express'),
    session = require('express-session'),
    OAuth = require('oauth').OAuth;

const isDebug = process.env.DEBUG !== undefined;

const settings = require('./settings');
const port = process.env.PORT || settings.port;
const host = isDebug ? `http://localhost:${port}` : `http://followmgr.azurewebsites.net`;

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

const template = fs.readFileSync(`${__dirname}/public_html/index.ejs`, 'utf-8');

const app = express();
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 30 * 60 * 1000  // 30 min
    }
}));
app.listen(port);

console.log(`Server running at ${host}, ${port}`);

const oa = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    CONSUMER_KEY,
    CONSUMER_SECRET,
    '1.0A',
    `${host}/auth/twitter/callback`,
    'HMAC-SHA1'
);

app.get('/auth/twitter', function(request, result) {
    oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, _) {
        if (error) {
            console.error(error);
            result.send("Didn't work.");
        }
        else {
            request.session.oauth = {
                token: oauth_token,
                token_secret: oauth_token_secret
            };
            console.log(`oauth.token: ${request.session.oauth.token}`);
            console.log(`oauth.token_secret: ${request.session.oauth.token_secret}`);
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
