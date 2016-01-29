(function() {

    var app = angular.module('index', [
        'ngRoute',
        'ngCookies'
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

    app.controller('PlaylistController', ['$cookies', function($cookies) {
        console.log('in playlist controller');

        var access_token = $cookies.get('access_token');
        var refresh_token = $cookies.get('refresh_token');
        
        this.playlists = [
            {
                fullName: 'rap',
            }, {
                fullName: 'rock'
            }, {
                fullName: 'beatles'
            }
        ];

        console.log(this.playlists);
        
    }]);

    
})();
