var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var sass = require('gulp-sass');
var sequence = require('run-sequence');

var paths = {
    alljs: 'public/js/*.js',
    allscss: 'public/scss/*.scss',
    components: ['public/components/angular.min.js', 'public/components/angular-route.min.js', 'public/components/angular-cookies.min.js'],
    templates: 'public/templates/*.html',
    src: 'public/',
    dist: 'build/'
}

/**
 * Delete the build folder, and everything in it
 */
gulp.task('clean', function() {
    return del(paths.dist);
});

/**
 * Jshint helps detect errors and potential problems in JavaScript code
 */
gulp.task('lint', function() {
    return gulp.src(paths.alljs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/**
 * Generates css files
 */
gulp.task('sass', function() {
    return gulp.src(paths.allscss)
        .pipe(sass())
        .pipe(gulp.dest(paths.dist + 'css/'));
});

/**
 * Generates css file for local use
 */
gulp.task('sass-local', function() {
   return gulp.src(paths.allscss)
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
        .pipe(concat('all-angular.min.js'))
        .pipe(gulp.dest(paths.dist + 'components/'));
    
    gulp.src(paths.alljs)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(paths.dist + 'js/'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + 'js/'));
    
    return gulp.src('public/index.html')
        .pipe(htmlreplace({
            scripts: 'js/all.min.js',
            components: 'components/all-angular.min.js'
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
    gulp.watch(paths.allscss, ['sass', 'sass-local']);
});

/**
 * Build for production
 */
//gulp.task('build', sequence('clean', ['sass', 'lint', 'templates', 'scripts']));

gulp.task('build', function(callback) {
    sequence('clean', ['sass', 'lint', 'templates', 'scripts'], callback);
});
