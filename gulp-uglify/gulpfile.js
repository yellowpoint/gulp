// http://www.ydcss.com/archives/54
var gulp = require('gulp'),
	concat = require('gulp-concat'),
    uglify = require('gulp-uglify');
 
gulp.task('jsmin', function () {

    gulp.src('src/js/*.js')
        .pipe(concat('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist/js'));

    gulp.src('dist/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js_min'));
});