'use strict';

const //http = require('http'),
    fs = require('fs'),
    ejs = require('ejs'),
    //qs = require('qs'),
    express = require('express');
const settings = require('./settings');
const port = process.env.port || settings.port;
const template = fs.readFileSync(`${__dirname}/public_html/index.ejs`, 'utf-8');

const app = express();
app.listen(port);

console.log(`Server running at port ${port}`);

app.get('/', function(request, result) {
    var data = ejs.render(template, {});
    result.writeHead(200, {'Content-Type': 'text/html'});
    //result.write(data);
    result.write(JSON.stringify(process.env));
    result.end();
});
