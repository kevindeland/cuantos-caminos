
var geniusApi = require('../lib/genius-api');



module.exports.searchTest = function(test) {
    
    geniusApi.search("Poetic Justice Kendrick Lamar", function(err, body) {

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

//            console.log(song);
            
            test.done();
        });
    });

    
};
