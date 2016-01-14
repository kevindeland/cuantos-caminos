

var genius = require('rapgenius-js');

module.exports.getRandomVerse = function(songName, artist, callback) {
    
    console.log('searching for track ' + songName + ' by ' + artist);

    genius.searchSong(songName, 'rock', function(err, songs) {

        var match = null;
        
        songs.forEach(function(song) {
            //                          var song = songs[2];
            // remove quotations
            var bys = song.name.split('by');
            var found_artist = bys[bys.length-1].trim();

            var found_song = bys[0].trim();
            //                              console.log(' ' + bys.length + ' song: ' + found_song + ' artist:' + found_artist);
            // in case 'by' exists in song name e.g. 'Fly by Night by Led Zeppelin'
            if(bys > 2) {
                for(var i = 1; i < bys.length - 1; i++) {
                    found_song += ' by ' + bys[i];
                }
            }
            //                              console.log('comparing ' + songName + ' with ' + found_song);
            var upperSource = artist.toUpperCase().replace(/\s/g, '');
            var upperTarget = found_artist.toUpperCase().replace(/\s/g, '');
//            console.log('comparing ' + upperSource + ' with ' + upperTarget );// + ' at ' + selectOne);

            /*console.log(' ' + upperSource.length + ' ' + upperTarget.length);
              for debugging character differences
              for(var i = 0; i < upperSource.length; i++) {
              console.log('' + i + ' ' + upperSource[i] + ' '+ upperTarget[i] + ' == ' + (upperSource[i] == upperTarget[i]));
              } 
              console.log(upperSource.indexOf(upperTarget));
              console.log(upperTarget.indexOf(upperSource)); */

            if((upperSource.indexOf(upperTarget) >= 0) || (upperTarget.indexOf(upperSource) >= 0)) {
                console.log('found a match at ' + song.link);
                if(match) return;
                match = song.link;
                genius.searchLyricsAndExplanations(song.link, "rap", function(err, lyrics) {
                    if(err) {
                        console.log('ERROR:', err);
                    }
                    console.log(lyrics.lyrics);
                    var allSections = lyrics.lyrics.sections;
                    console.log(JSON.stringify(lyrics.lyrics.sections));
                    var randomSection = lyrics.lyrics.sections[Math.floor(Math.random() * lyrics.lyrics.sections.length)];
                    console.log(JSON.stringify(randomSection));
                    var randomVerse = randomSection.verses[Math.floor(Math.random() * randomSection.verses.length)];
                    console.log(JSON.stringify(randomVerse));
                    
                    while(!randomVerse) {
                        console.log('trying again');
                        randomSection = lyrics.lyrics.sections[Math.floor(Math.random() * lyrics.lyrics.sections.length)];
                        randomVerse = randomSection.verses[Math.floor(Math.random() * randomSection.verses.length)];
                    }
                    console.log('------ found verse -----');
                    
                    console.log(randomVerse.content);

                    callback(null, randomVerse.content);
                    
                })
            }
        });

        if(match == null) {
            console.log('NO MATCH FOUND');
            callback(null, null);
        }

    });
};

function getRandomLines(lyrics) {
    

}
