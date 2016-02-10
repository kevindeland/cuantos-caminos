var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var sass = require('gulp-sass');
var sequence = require('run-sequence');
var bower = require('gulp-bower');
var child_process = require('child_process');

var paths = {
    js: 'public/js/*.js',
    scss: 'public/scss/*.scss',
    templates: 'public/templates/*.html',
    components: [
        'public/components/angular/angular.min.js',
        'public/components/angular-route/angular-route.min.js',
        'public/components/angular-cookies/angular-cookies.min.js'
    ],
    src: 'public/',
    dist: 'build/'
}

/**
 * Delete the build folder, and everything in it
 */
gulp.task('clean', function() {
    return del(paths.dist);
});

gulp.task('bower', function() {
    return bower();
});

/**
 * Jshint helps detect errors and potential problems in JavaScript code
 */
gulp.task('lint', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/**
 * Generates css files
 */
gulp.task('sass', function() {
    return gulp.src(paths.scss)
        .pipe(sass())
        .pipe(gulp.dest(paths.dist + 'css/'));
});

/**
 * Generates css file for local use
 */
gulp.task('sass-local', function() {
   return gulp.src(paths.scss)
        .pipe(sass())
        .pipe(gulp.dest(paths.src + 'css/'));
});

/**
 * copy angular templates into dist.
 */
gulp.task('templates', function() {
    return gulp.src(paths.templates)
        .pipe(gulp.dest(paths.dist + 'templates/'));
});

/**
 * Concat and minify JavaScript files
 * Replace script tags in index.html
 */
gulp.task('scripts', function() {
    gulp.src(paths.components)
        .pipe(concat('components.min.js'))
        .pipe(gulp.dest(paths.dist + 'components/'));
    
    gulp.src(paths.js)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(paths.dist + 'js/'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + 'js/'));
    
    return gulp.src('public/index.html')
        .pipe(htmlreplace({
            scripts: 'js/all.min.js',
            components: 'components/components.min.js'
        }))
        .pipe(gulp.dest(paths.dist));
});

/**
 * Watch for changes
 */
gulp.task('watch', function() {
    gulp.watch(paths.js, ['lint', 'scripts']);
    gulp.watch(paths.components, ['scripts']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.scss, ['sass', 'sass-local']);
});

/**
 * Build for production
 */
gulp.task('build', function(callback) {
    sequence(['clean', 'bower'], ['sass', 'lint', 'templates', 'scripts'], callback);
});

gulp.task('deploy', ['build'], function() {

    var pass = process.env['CF_SECRET'];
    var branch = process.env['TRAVIS_BRANCH'];
    var space = (branch === 'master') ? 'prod' : 'dev';
    var manifest = (branch === 'master') ? '' : ' -f manifest.yml.dev';

    log(child_process.execSync('cf api api.ng.bluemix.net'));
    log(child_process.execSync('cf auth kmdeland@us.ibm.com ' + pass));
    log(child_process.execSync('cf target -o kevins-org -s ' + space));
    // be patient, the whole command must be executed before it prints anything
    log(child_process.execSync('cf push ' + manifest)); 
});

gulp.task('default', ['deploy']);

function log (msg) {
    console.log(msg.toString());
}
