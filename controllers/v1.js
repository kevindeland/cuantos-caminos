var async = require('async'),
    _ = require('underscore'),
    chalk= require('chalk');

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

/**
 * 1) pick one track, get lyrics for it
 * -- repeat until you get a track with lyrics
 * 2) populate the other three tracks
 * -- they must be unique
 */
function pickRandomTracks(tracks, callback) {
    console.log('found ' + tracks.items.length + ' tracks');

    var NUM_CHOICES = 4,
        indices = [],
        track_choices = [];

    var correct_answer;

    function pickRandomTrack(tracks, failed_indices, callback) {
        
        var rand_index = rand(tracks.items.length),
            full_track = tracks.items[rand_index].track,
            
            track = {
                song: full_track.name,
                artist: full_track.artists[0].name
            };


        
        track.song = sanitizeSongName(track.song);

        genius.getRandomVerse(track.song, track.artist, function(err, verse) {
            console.log('got verse ' + verse);
            if(err) {
                callback(err);
            } else if (!verse) {
                // make sure we don't check again
                failed_indices.push(rand_index);
                pickRandomTrack(tracks, failed_indices, callback);
            } else {
                track.verse = verse;
                track.index = rand_index;
                track.correct = true;
                callback(null, track);
            }
        })
    }

    pickRandomTrack(tracks, [], function(err, track) {
        console.log('picked track %s', chalk.blue(JSON.stringify(track)));

        track_choices.push(track);
        indices.push(track.index);
        
        for (var i = 1; i < NUM_CHOICES; i++) {
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
            console.log('choosing track %s', chalk.blue(JSON.stringify(newest_track)));
            track_choices.push(newest_track);

        }

        var spanish = null;

        track_choices = jumbleTrackOrder(track_choices);
        var correct_index = track_choices.correct_i;
        console.log(track_choices, correct_index);
        
        callback(null, track_choices.tracks, track_choices.tracks[correct_index].verse);

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

/**
 * Fisher-Yates shuffle
 * http://bost.ocks.org/mike/shuffle/
 */
function jumbleTrackOrder(tracks) {
    var m = tracks.length, temp, i, correct_i;
    
    // While there remain elements to shuffle
    while(m) {
        // pick random element from an ever-decreasing m
        i = Math.floor(Math.random() * m--);
        
        // splice removes the element, push adds it to the new array
        //        copy.push(array.splice(i, 1)[0]);
        // but splice takes N operations to move each element, so...

        // simply swapping it with the current element will give us the same result
        t = tracks[m];
        tracks[m] = tracks[i];
        tracks[i] = t;
        // must keep track of which track is correct (after swap: use m, not i)
        if(tracks[m].correct) {
            correct_i = m;
        }
    }

    return {tracks: tracks, correct_i: correct_i};
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
