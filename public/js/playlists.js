
(function() {
    console.log('in playlists.js');
    var app = angular.module('playlists', []);

    app.controller('PlaylistController', function() {
        console.log('in Playlist controller');
        this.playlists = [
            {
                fullName: 'Starred by Kevin DeLand',
                user_id: 'dummy',
                playlist_id: 'dummy'
            }
        ];
    });
    
})();
