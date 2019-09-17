var gulp = require('gulp');
var changed = require('gulp-changed');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');

// 我们在这里定义一些常量以供使用
var SRC = 'src/*.js';
var DEST = 'dist';

gulp.task('default', function() {
    return gulp.src(SRC)
        // `changed` 任务需要提前知道目标目录位置
        // 才能找出哪些文件是被修改过的
        .pipe(changed(DEST))
        // 只有被更改过的文件才会通过这里
        // .pipe(jscs())
        // .pipe(uglify())
        // .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('dest'))
});