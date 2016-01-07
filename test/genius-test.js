
var genius = require('../lib/genius');

module.exports.getRandomVerse = function(test) {

    // testing with this Beatles song because it has some null verses
    var songName = 'Good Day Sunshine';
    var artistName = 'The Beatles';

    genius.getRandomVerse(songName, artistName, function(err, content) {

        console.log(content);
        
        test.done();
    });
    
};
