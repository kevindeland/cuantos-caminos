var async = require('async');
var _ = require('underscore');

var spotify = require('../lib/spotify');
var genius = require('../lib/genius');
var watson = require('../lib/watson');


var rand = function(max) {
    return Math.floor((Math.random() * max));
}


function getPlaylistTracks (access_token) {
    return function (tracks_href, callback) {
        spotify.getSomePlaylistTracks(access_token, tracks_href, callback);
    }
};
function pickRandomTracks(tracks, callback) {
    console.log('found ' + tracks.items.length + ' tracks');

    var NUM_CHOICES = 4;
    var indices = [];
    var track_choices = [];
    for(var i = 0; i < NUM_CHOICES; i++) {
        var potential = rand(tracks.items.length);

        while(indices.indexOf(potential)  >= 0) {
            potential = rand(tracks.items.length);
        }
        
        var potential_track = tracks.items[potential].track;
        var newest_track = {
            song: potential_track.name,
            artist: potential_track.artists[0].name
        }
        newest_track.song = sanitizeSongName(newest_track.song);
        console.log('testing track ' + JSON.stringify(newest_track));
        track_choices.push(newest_track);
    }

    // TODO ALL OF THESE TRACKS MUST BE LEGIT

    console.log(track_choices);
    // pick random one to be the answer
    var correct_answer = track_choices[rand(NUM_CHOICES)];
    correct_answer.correct = true;

    var spanish = null;
    
    genius.getRandomVerse(correct_answer.song, correct_answer.artist, function(err, verse) {
        console.log('got verse ' + verse);
        if(verse) {
            callback(null, track_choices, verse);
        } else {
            callback(null, track_choices, null);
        }
    });
    
};
/**
 * Remove 'Remastered' and other various impurities...
 */
function sanitizeSongName(song_name) {
    var remastered_string = '- Remastered';
    var other = ' - Mono / Remastered 2015';
    if(song_name.indexOf(remastered_string) > 0) {
        var splice_me = song_name.indexOf(remastered_string);
        song_name = song_name.substring(0, splice_me).trim();
    }
    return song_name;
}

function translate(track_choices, verse, callback) {
    watson.language.translate({
        text: verse,
        source: 'en', target: 'es'
    }, function(err, translation) {
        if(err || !translation) {
            callback(null, track_choices, null); return;
        }
        console.log('received translation ', JSON.stringify(translation, null, 2));
        var verso = translation.translations ? translation.translations[0].translation : null;
        callback(err, track_choices, verse, verso);
    });
};
module.exports = {

    /**
     * returns one "Quizlet", aka 4 possible songs, and 1 English --> Spanish translation
     */
    quizlet: {
        get: function(req, res) {

            var access_token = req.query.access_token;
            var user_id = req.params.user;
            var playlist_id = req.params.playlist;

            async.waterfall([
                function buildHref(callback) {
                    var href = 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks';
                    console.log(href);
                    callback(null, href);
                },
                getPlaylistTracks(access_token),
                pickRandomTracks,
                translate
            ], function(err, track_choices, english, spanish) {
                var result = {
                    spanish: spanish,
                    english: english,
                    choices: track_choices
                };
                console.log(result);
                res.send(result)                
            });
        }
    }
}
