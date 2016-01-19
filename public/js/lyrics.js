(function() {
    angular.module('lyrics', [])

    // Service that performs an API call to get lyrics
        .service('lyricsService', ['$http', function($http, $sce) {

            function doHttpGet(path, callback) {
                $http.get(path)
                    .success(function(data, status, headers, config) {
                        callback(data);
                    });
            }
            
            this.getQuizlet = function(access_token, callback) {
                // call quizlet service
                route = '/api/v1/quizlet?access_token=' + access_token;
                console.log('requesting route ' + route);
                doHttpGet(route, function(data) {
                    console.log(data);
                    callback(data);
                })
            }

            this.getPlaylistQuizlet = function(access_token, user, playlist, callback) {
                // call quizlet service
                route = '/api/v1/quizlet/' + user + '/' + playlist + '?access_token=' + access_token;
                console.log('requesting route ' + route);
                doHttpGet(route, function(data) {
                    console.log(data);
                    callback(data);
                })
            }
        }])
})();
