// http://www.ydcss.com/archives/41
var gulp = require('gulp'),
	cssver = require('gulp-make-css-url-version'); 
    cssmin = require('gulp-clean-css');
 
gulp.task('testCssmin', function () {
    gulp.src('src/css/*.css')
    	.pipe(cssver())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});