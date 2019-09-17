var gulp = require('gulp'),
    htmlmini = require('gulp-html-minify'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    filter = require('gulp-filter'),
    RevAll = require('gulp-rev-all'),
    del = require('del'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel');



gulp.task('default',['del','auto'], function () {
    var jsFilter = filter(['**/*.js','!**/*.min.js'],{restore:true}),
        cssFilter = filter('**/*.css',{restore:true}),
        htmlFilter = filter(['**/*.html'],{restore:true});
    gulp.src('src/*.html')
        .pipe(useref())                         // 解析html中的构建块
        .pipe(jsFilter)                         // 过滤所有js
        .pipe(babel())
        .pipe(uglify())                         // 压缩js，无法压缩es6的
        .pipe(jsFilter.restore)
        .pipe(cssFilter)                        // 过滤所有css
        .pipe(autoprefixer({
            browsers: ['>5%', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(cssmin())                           // 压缩优化css
        .pipe(cssFilter.restore)
        .pipe(RevAll.revision({                 // 生成版本号
            dontRenameFile: ['.html'],          // 不给 html 文件添加版本号
            dontUpdateReference: ['.html']      // 不给文件里链接的html加版本号
        }))
        .pipe(htmlFilter)                       // 过滤所有html
        .pipe(htmlmini())                       // 压缩html
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest('dist'))
})

gulp.task('del',function () {
    del(['./dist/**/*.*','!./dist/img/**/*.*','!./dist/font/**/*.*']);     //构建前先删除dist文件里的旧版本,除了图片，图片压缩时间长
})

//监控改动并自动刷新任务;
gulp.task('auto', function() {

    gulp.watch('src/**/*.*', ['default']);

});

gulp.task('img', function () {
    del(['./dist/img/**/*.*']);
    gulp.src('./src/img/**/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        // .pipe(RevAll.revision())
        .pipe(gulp.dest('./dist/img'));
});

//图片压缩较耗时，单独用gulp img;