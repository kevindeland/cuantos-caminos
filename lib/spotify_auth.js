var request = require('request');
var qs = require('querystring');

// TODO change these values
var client_id = 'e10a51e188f34089857915f71a2d39d3';
var client_secret = 'ca83412781fe4683b76f6035639f1f53'; // Your client secret


var spotify_auth_url = 'https://accounts.spotify.com/authorize';
var spotify_api_token_url =  'https://accounts.spotify.com/api/token';

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

        res.redirect(spotify_auth_url + '?' +
                     qs.stringify({
                         response_type: 'code',
                         client_id: client_id,
                         scope: scope,
                         redirect_uri: redirect_uri,
                         state: state
                     }));
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
                url: spotify_api_token_url,
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

                    // pass the token to the browser to make requests from there
                    res.redirect(redirect_path + qs.stringify({access_token: access_token, refresh_token: refresh_token}));
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
