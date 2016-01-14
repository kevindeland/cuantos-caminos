
(function() {
    console.log('in login.js');
    var app = angular.module('index', []);

    app.controller('LoginController', ['$location', function($location) {
        console.log('Login controller');

        this.access_token = $location.search().access_token;
        console.log($location);

        this.loggedIn = false;
        this.isLoggedIn = function() {
            // if there is an access_token, they are *probably* logged in
            console.log(this.access_token);
            //            return this.access_token;
            return this.loggedIn;
        }

        this.display_name = "Kevin DeLand BeforeTime";
        this.id = "xxxIxxx";

        this.executeLogin = function() {
            this.loggedIn = true;
        };
    }]);
    
})();
