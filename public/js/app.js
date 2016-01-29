(function() {

    var app = angular.module('index', [
        'ngRoute', // simple page routing and templating
        'ngCookies', // for cookies
        'spotify' // for spotify APIs and such
    ])

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/login.html',
                controller: 'LoginController',
                controllerAs: 'loginCtrl'
            })
            .when('/playlists', {
                templateUrl: 'templates/playlists.html',
                controller: 'PlaylistController',
                controllerAs: 'playlistCtrl'
            })
        
            .otherwise({redirectTo: '/'});
    }]);

    app.controller('LoginController', ['$location', function($location) {
        console.log('in login controller');

        this.clickMe = function() {
            console.log('clicked');
        };
    }]);

    app.controller('PlaylistController', ['$cookies', 'spotifyService', function($cookies, spotifyService) {
        console.log('in playlist controller');

        var that = this;
        
        this.access_token = $cookies.get('access_token');
        this.refresh_token = $cookies.get('refresh_token');
        this.user = null;

        spotifyService.getMe(this.access_token, function(response) {
            that.user = response.data;
        });
        
        this.playlists = [
            {
                fullName: 'rock',
                user: 'spotify',
                playlist: '2Qi8yAzfj1KavAhWz1gaem'

            }, {
                fullName: 'rap',
                user: 'spotify',
                playlist: '4jONxQje1Fmw9AFHT7bCp8'
                
            }, {
                fullName: 'beatles',
                user: 'spotify',
                playlist: '5hy00Zmp1HNIR3xTgTDOaM'

            }
        ];

        console.log(this.playlists);
        
    }]);

    
})();
