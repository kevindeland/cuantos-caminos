var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var sass = require('gulp-sass');

var paths = {
    alljs: 'public/js/*.js',
    allscss: 'public/scss/*.scss',
    components: ['public/components/angular.min.js', 'public/components/angular-route.min.js', 'public/components/angular-cookies.min.js'],
    templates: 'public/templates/*.html',
    dist: 'public/dist'
}

gulp.task('lint', function() {
    return gulp.src(paths.alljs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// TODO copy css (sassify)
gulp.task('sass', function() {
    return gulp.src(paths.allscss)
        .pipe(sass())
        .pipe(gulp.dest('public/dist/css'));
});

// copy angular templates into dist.
gulp.task('templates', function() {
    return gulp.src(paths.templates)
        .pipe(gulp.dest('public/dist/templates'));
});

// concat and minify scripts.
// replace script tags in index.html
gulp.task('scripts', function() {
    gulp.src(paths.components)
        .pipe(concat('all-angular.min.js'))
        .pipe(gulp.dest(paths.dist + '/components'));
    
    gulp.src(paths.alljs)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(paths.dist + '/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + '/js'));
    
    return gulp.src('public/index.html')
        .pipe(htmlreplace({
            scripts: 'js/all.min.js',
            components: 'components/all-angular.min.js'
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function() {
    gulp.watch(paths.js, ['lint', 'scripts']);
    gulp.watch(paths.components, ['scripts']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.allscss, ['sass']);
});

gulp.task('default', ['lint', 'templates', 'scripts']);

/*sass.
bower.
cat css
cat javascript 
uglify javascript
*/
