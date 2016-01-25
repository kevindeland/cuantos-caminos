
var geniusApi = require('../lib/genius-api');
var chalk = require('chalk');


module.exports.searchTest = function(test) {

    var songTitle = "Pour Some Sugar On Me (2012)",
        artist = "Def Leppard",
        searchTerm = songTitle + ' ' + artist;
    
    geniusApi.search(searchTerm, function(err, body) {

        console.log('found %s results', chalk.yellow(body.length));
        body.forEach(function(bod) {
            console.log(chalk.red(JSON.stringify(bod)));
        });
        var hit = body[0].result;

        console.log(chalk.blue(JSON.stringify(hit)));
        test.equals(songTitle.toLowerCase(), hit.title.toLowerCase());
        test.equals(artist.toLowerCase(), hit.primary_artist.name.toLowerCase());
        
        test.done();
        return;
        
    });
};

module.exports.failSearchTest = function(test) {
    
    geniusApi.search("Got to get you into my life The Beatles", function(err, body) {

        body.forEach(function(hit) {
            console.log(hit);
        });
        test.done();
    });
};

/**
 * Takes an artist and a title, gives back a song ID
 */
module.exports.searchByTitleAndArtist = function(test) {
    
    geniusApi.getIdBySongAndArtist("Poetic Justice", "Kendrick Lamar", function(err, body) {
        test.equals(null, err);
        console.log(body);
        console.log(body.id);
        test.equals(body.id, 92856);
        test.done();
    });
};

module.exports.integrateSearchAndSong = function(test) {

    geniusApi.getIdBySongAndArtist("Poetic Justice", "Kendrick Lamar", function(err, body) {
        test.equals(null, err);
        console.log(body);
        console.log(body.id);
        test.equals(body.id, 92856);

        geniusApi.getSongById(body.id, function(err, song) {

          console.log(song);
            
            test.done();
        });
    });
    
};

module.exports.getRandomVerse = function(test) {

//    geniusApi.getRandomVerse("Poeti
};
