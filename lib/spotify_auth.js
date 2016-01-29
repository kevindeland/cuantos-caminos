var request = require('request'),
    qs = require('querystring'),
    chalk = require('chalk');

var config = require('../config').spotify;

var client_id = config.client_id;
var client_secret = config.client_secret;


var SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
var SPOTIFY_API_TOKEN_URL =  'https://accounts.spotify.com/api/token';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';


function generateLoginFunction(redirect_uri) {
    return function login (req, res) {
        console.log('logging in; redirect_uri: ' + redirect_uri);
        
        var state = generateRandomString(16);
        res.cookie(stateKey, state);

        // your application requests authorization
        var scope = 'user-read-private user-read-email';

        var redirectUrl = SPOTIFY_AUTH_URL + '?' +
                     qs.stringify({
                         response_type: 'code',
                         client_id: client_id,
                         scope: scope,
                         redirect_uri: redirect_uri,
                         state: state
                     });
        console.log('redirecting to ' + redirectUrl);
        res.redirect(redirectUrl);
    }
}

function buildAuthHeader(access_token) {
    return {
        'Authorization': 'Bearer ' + access_token
    }
}

function generateCallbackFunction(redirect_uri, redirect_path) {
    return function callback(req, res) {
        console.log('in callback; redirect_uri: ' + redirect_uri);
        
        // your application requests refresh and access tokens
        // after checking the state parameter
        
        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[stateKey] : null;

        if (state === null || state !== storedState) {
            res.redirect(redirect_path + qs.stringify({error: 'state_mismatch'}));
        } else {
            res.clearCookie(stateKey);
            var authOptions = {
                url: SPOTIFY_API_TOKEN_URL,
                form: {
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                json: true
            };

            request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {

                    access_token = body.access_token,
                    refresh_token = body.refresh_token;

                    // TODO better cookie names?
                    res
                        .cookie('access_token', access_token)
                        .cookie('refresh_token', refresh_token)
                        .redirect(redirect_path);
                } else {
                    res.redirect(redirect_path + qs.stringify({error: 'invalid_token'}));
                }
            });
            
        }
        
    }
}

function refreshToken(req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
}

module.exports = {
    generateLogin: generateLoginFunction,
    generateCallback: generateCallbackFunction,
    refreshToken: refreshToken
}
