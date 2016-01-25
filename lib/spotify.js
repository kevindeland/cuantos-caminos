var request = require('request'),
    chalk = require('chalk');


module.exports = {

    getMe: function(access_token, callback) {

        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        request.get(options, function(err, response, body) {
            callback(err, body);
        });
    },

    getUserPlaylists: function(access_token, user_id, callback) {
        var options = {
            url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        request.get(options, function(err, response, body) {
            callback(err, body);
        });
    },

    getSomePlaylistTracks: function(access_token, tracks_href, callback) {
        var offset = '0'         // TODO change this
        var url = tracks_href + '?offset=' + offset + '&fields=total,limit,items.track(artists,name)';

        var options = {
            url: url,
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        console.log('getting playlist tracks');
        console.log(options);

        request.get(options, function(err, response, body) {
            if(body.error) {
                console.log(chalk.red("ERROR "), body.error.message);
                callback(new Error(body.error.message));
                return;
            }
            callback(err, body);
        });
    },

    // TODO
    getAllPlaylistTracks: function(access_token, user_id, playlist_id, callback) {

        var base_url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '?offset=';
        var fields = '&fields=total,limit,items.track(artists,name)';
        
        var options = {
//            url: 
        }
        
        var offset = 0;

        while(x) {
            
//            request.get(options
        }
    }
}
