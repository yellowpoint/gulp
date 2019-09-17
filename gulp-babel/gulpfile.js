

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    browserify = require('browserify');

gulp.task('default', function () {

    gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(browserify())
        .pipe(gulp.dest('dist'));
});