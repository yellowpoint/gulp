var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if');

    gulp.task('default', function () {
    // var assets = useref.assets();


    return gulp.src('src/*.html')

        .pipe(useref())
        .pipe(gulp.dest('dist'));
});