
var request = require('request');

var auth = {
    CLIENT_ID: "Fws97DdYqGMu1nb_-CuJC6PQSWFb-EpSgAajmMdNP8I1iUcWEcGiCNozaNRy23bt",
    CLIENT_SECRET: "BcxbTYkK2piObvicZn5vRwOdg1HXukhMMbZGvBGGlG8MFDJefI04tyIzpyXGlofZbcVeUZzcWGkfAzZmNNwVow",
    CLIENT_ACCESS_TOKEN: "o7MVUpHVcNcmcG05DDBPeh0QyfX3PJtTP1R3ZHOjBzZU25vq9v7eXFzyEZ69oeqP"
};

var url = "http://api.genius.com";


function search(searchTerm, callback) {
    searchTerm = encodeURIComponent(searchTerm);
    
    var get = {
        method: 'GET',
        url: url + '/search?q=' + searchTerm,
        headers: {
            Authorization: 'Bearer ' + auth.CLIENT_ACCESS_TOKEN
        }
    };
    
    request(get, function(err, response, body) {
        if(err) {
            console.log('ERROR:', err);
            callback(err);
        } else {
//            console.log(body);
            var json = JSON.parse(body);
//            console.log(json);
            console.log('Found ' + json.response.hits.length + ' hits matching ' + searchTerm);

            callback(null, json.response.hits);
            
        }
    });
};

function getIdBySongAndArtist(song, artist, callback) {
    var searchTerm = song + " " + artist;
    search(searchTerm, function(err, result) {
        if(err) {
            callback(err);
            return;
        }
        // TODO pick one song
        
        
        callback(null, result[0].result);
    });
};

function getSongById(id, callback) {

    var get = {
        method: 'GET',
        url: url + '/songs/' + id,
        headers: {
            Authorization: 'Bearer ' + auth.CLIENT_ACCESS_TOKEN
        }
    };
    
    request(get, function(err, response, body) {
        if(err) {
            console.log('ERROR:', err);
            callback(err);
        } else {
           console.log(body);
            var json = JSON.parse(body);
//            console.log(json);

            var res = json.response.song;
            console.log(Object.keys(res));
            console.log(res);
            var description_annotation = res['description_annotation'];
            console.log(description_annotation);
            callback(null, res);
            
        }
    })
};

module.exports = {
    search: search,
    getIdBySongAndArtist: getIdBySongAndArtist,
    getSongById: getSongById
}
