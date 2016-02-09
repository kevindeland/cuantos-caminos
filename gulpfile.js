var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');

var paths = {
    alljs: 'public/js/*.js',
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

// TODO copy angular templates
gulp.task('templates', function() {
    return gulp.src(paths.templates)
        .pipe(gulp.dest('public/dist/templates'));
});


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
});

gulp.task('default', ['lint', 'templates', 'scripts']);

/*sass.
bower.
cat css
cat javascript 
uglify javascript
*/
