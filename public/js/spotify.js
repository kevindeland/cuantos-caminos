(function() {
    angular.module('spotify', [])

        .service('spotifyService', ['$http', function($http) {

            this.getMe = function(access_token, callback) {

                var req = {
                    method: 'GET',
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
                console.log(req);
                
                $http(req).then(callback);
            };
            
        }])
})();
