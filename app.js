/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var fs = require('fs');

// libs
var spotifyAuth = require('./lib/spotify_auth');

var genius = require('./lib/genius');

// controllers
var controllers = {};
var controllers_path = './controllers';
fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
      	controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
    } 
});
   
// KMD move-ables
var _ = require('underscore');

var watson = require('watson-developer-cloud');
var language = watson.language_translation({
    username: '814a1d97-6f96-4f81-8b10-dd05dd948741',
    password: '5u05jscmNnBZ',
    version: 'v2'
});

var app = express();

app.use(express.static(__dirname + '/public'))
    .use(cookieParser());


var access_token = null;
function buildHeader() {
    return {
        headers: { 'Authorization': 'Bearer ' + access_token }
    }
}


var port = process.env.PORT || 8888
var my_uri = process.env.VCAP_SERVICES ? 'http://cuantos-caminos.mybluemix.net' : 'http://localhost:' + port; //
var redirect_uri = my_uri + '/callback';

app.get('/login', spotifyAuth.generateLogin(redirect_uri));
app.get('/callback', spotifyAuth.generateCallback(redirect_uri, '/#'));
app.get('/refresh_token', spotifyAuth.refreshToken);

app.get('/api/v1/quizlet', controllers.v1.quizlet.getRandom);
app.get('/api/v1/quizlet/:user/:playlist', controllers.v1.quizlet.get);

console.log('Listening on port ' + port);
app.listen(port);
