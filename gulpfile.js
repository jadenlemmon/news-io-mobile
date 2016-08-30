var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./www/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('bower:js', function () {
        return gulp.src([
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/hammerjs/hammer.min.js',
            './bower_components/web-pull-to-refresh/lib/wptr.1.1.js',
            './bower_components/semantic/dist/semantic.min.js',
            './bower_components/underscore/underscore-min.js',
            './bower_components/angular/angular.min.js',
            './bower_components/angular-animate/angular-animate.min.js',
            './bower_components/angular-route/angular-route.min.js',
            './bower_components/angular-sanitize/angular-sanitize.min.js',
            './bower_components/moment/min/moment.min.js'
        ])
        .pipe(gulp.dest('./www/js/vendors'));
});

gulp.task('bower:refresh', function () {
    return gulp.src([
            './bower_components/web-pull-to-refresh/lib/**/genericons/**'
        ])
        .pipe(gulp.dest('./www/css/vendors'));
});

gulp.task('bower:semantic', function () {
    return gulp.src([
            './bower_components/semantic/dist/semantic.min.css',
            './bower_components/semantic/dist/**/themes/**/default/**'
        ])
        .pipe(gulp.dest('./www/css/vendors/semantic'));
});