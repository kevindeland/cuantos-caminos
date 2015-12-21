
(function() {
    // depends on 'lyrics' module
    var app = angular.module('quiz', ['lyrics']);

//    app.config([
    
    app.controller('QuizController', ['$location', 'lyricsService', function($location, lyricsService) {
        console.log('in quiz controller');
        var este = this;

        this.access_token = $location.search().access_token;

        this.rock = {
            user: 'spotify',
            playlist: '2Qi8yAzfj1KavAhWz1gaem'
        }

        this.loadData = function() {
            //    lyricsService.getQuizlet(this.access_token, function(data) {
            lyricsService.getPlaylistQuizlet(this.access_token, this.rock.user, this.rock.playlist, function(data) {
                
                este.spanish = data.spanish;
                este.english = data.english;

                data.choices.forEach(function(choice) {
                    choice.full = choice.song + ' by ' + choice.artist;
                });
                este.choices = data.choices;
            })
        };

        this.loadData();
        
        // initialize null selection
        // maybe move this to load data???
        this.choice = null;
        this.hasAnswered = false;

        this.selectChoice = function(setChoice) {
            this.choice = setChoice;
        }

        this.isSelected = function(checkChoice) {
            return this.choice === checkChoice;
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
            this.loadData();
            this.chioce = null;
            this.hasAnswered = false;

        }
        
    }]);
    
})();

