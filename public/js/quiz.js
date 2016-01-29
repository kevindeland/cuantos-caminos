
(function() {
    // depends on 'lyrics' module
    var app = angular.module('quiz', [
        'ngCookies', // for getting access token
        'lyrics'
    ]);

    
    app.controller('QuizController', ['$location', '$cookies', 'lyricsService', function($location, $cookies, lyricsService) {
        console.log('in quiz controller');
        var este = this;

        this.access_token = $cookies.get('access_token');
        
        var url_params = $location.search();
        this.playlist_id = $location.search().playlist_id;
        console.log(this.playlist_id);
        this.user_id = $location.search().user_id;
        console.log(this.user_id);
        
        this.getSpanish = function() {
            if(this.spanish) {
                return this.spanish;
            } else {
                return "Loading new song...";
            }
        }
        
        this.justArtists = false;
        // there's no way to win if all the artists are the beatles
/*        if (this.playlist_id == 'beatles') {
            this.justArtists = false;
        }
*/
        
        this.loadData = function() {
            lyricsService.getPlaylistQuizlet(this.access_token, this.user_id, this.playlist_id, function(data) {
                if(data.err) {
                    este.error = data.err;
                    return;
                } else {
                    este.error = null;
                }
                este.spanish = data.spanish;
                este.english = data.english;

                data.choices.forEach(function(choice) {
                    choice.full = choice.song + ' by ' + choice.artist;
                });
                este.choices = data.choices;
            })
        };

        this.loadData();

        // different Title depending on whether you print just artists, or whole song
        this.getTitle = function() {
            if(this.justArtists) {
                return 'Que cantó esto?? (Who sings this?)';
            } else {
                return 'Qué canción es esta?? (Which song is this?)';
            }
        }

        // use as choice: artist, or full song name
        this.getChoice = function(index) {
            if(this.choices)
                return this.justArtists ? this.choices[index].artist : this.choices[index].full;
            else
                return 'Loading...';
        }
        
        // initialize null selection
        // maybe move this to load data???
        this.choice = null;
        this.hasAnswered = false;

        this.selectChoice = function(setChoice) {
            console.log('new selection:', setChoice);
            this.choice = setChoice;
        }

        this.getStyle = function(index) {
            if(this.isSelected(index))  {
                return 'active';
            } else if(this.hasAnswered && this.isCorrect(index)){
                return 'correct';
            } else if(this.hasAnswered && (this.choice == index) && !this.isCorrect(index) ) {
                return 'wrong';
            }
        }
        
        this.isSelected = function(checkChoice) {
            return !this.hasAnswered && this.choice === checkChoice;
        }

        this.isCorrect = function(choice) {
            return this.choices[choice].correct;
        }

        this.checkCorrect = function() {
            console.log('you selected: ' + this.choice);
            this.hasAnswered = true;
            if (this.choices[this.choice].correct) {
                console.log('CORRECT');
            } else {
                console.log('WRONG');
            }
        }

        this.getAnswer = function(i) {
            if(!this.hasAnswered)
                return 'false';
        }


        this.nextQuestion = function() {
            console.log('loading next question...');
            // reset everything so you can display "Loading..."
            this.choice = null;
            this.choices = null;
            this.spanish = null;
            this.hasAnswered = false;
            this.loadData();
        }


        this.getErrorMsg = function() {
            if(this.error) {
                return this.error;
            } else {
                return null;
            }
        }
    }]);
    
})();

