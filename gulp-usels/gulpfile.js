var gulp = require('gulp')
// var gulpif = require('gulp-if')
// var uglify = require('gulp-uglify')
// var cssmin = require('gulp-cssmin')
var usels = require('gulp-usels')
var prefix = {
        "{{res}}": "../res",
        '//geekie.online': '../res'
}
gulp.task('test',function(){
    gulp.src('./src/*.html')
        .pipe(usels(prefix))
        //.pipe(gulpif('*.js',uglify()))
        //.pipe(gulpif('*.css',cssmin()))
        .pipe(gulp.dest('./dist'))
        .pipe(usels.rewrite())
        .pipe(gulp.dest('./dist'))
})