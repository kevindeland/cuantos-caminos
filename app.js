/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'), // Express web server framework
    request = require('request'), // "Request" library
    querystring = require('querystring'),
    cookieParser = require('cookie-parser'),
    fs = require('fs');

// libs
var spotifyAuth = require('./lib/spotify_auth'); // for authenticating with spotify

// controllers
var controllers = {};
var controllers_path = './controllers';
fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
      	controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
    } 
});
   
var app = express();

app.use(express.static(__dirname + '/public'))
    .use(cookieParser());

var config = require('./config').url;

var port = config.port,
    my_uri = config.uri,
    redirect_uri = config.redirect_uri;

app.get('/login', spotifyAuth.generateLogin(redirect_uri));
app.get('/callback', spotifyAuth.generateCallback(redirect_uri, '/#/playlists'));
app.get('/refresh_token', spotifyAuth.refreshToken);

app.get('/api/v1/quizlet/:user/:playlist', controllers.v1.quizlet.get);

console.log('Listening on port ' + port);
app.listen(port);
