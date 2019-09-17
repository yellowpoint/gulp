var gulp = require('gulp'),
    htmlmini = require('gulp-html-minify'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    filter = require('gulp-filter'),
    RevAll = require('gulp-rev-all'),
    del = require('del');

// gulp.task('default',['del'], function () {
//     var jsFilter = filter('src/js/*.js',{restore:true}),
//         cssFilter = filter('src/css/*.css',{restore:true}),
//         htmlFilter = filter('src/*.html',{restore:true});
//     gulp.src('src/*.html')
//         .pipe(useref())                         // 解析html中的构建块
//         .pipe(jsFilter)                         // 过滤所有js
//         .pipe(uglify())                         // 压缩js
//         .pipe(jsFilter.restore)
//         .pipe(cssFilter)                        // 过滤所有css
//         .pipe(csso())                           // 压缩优化css
//         .pipe(cssFilter.restore)
//         .pipe(RevAll.revision({                 // 生成版本号
//             dontRenameFile: ['.html'],          // 不给 html 文件添加版本号
//             dontUpdateReference: ['.html']      // 不给文件里链接的html加版本号
//         }))
//         .pipe(htmlFilter)                       // 过滤所有html
//         .pipe(htmlmini())                       // 压缩html
//         .pipe(htmlFilter.restore)
//         .pipe(gulp.dest('dist'))
// })

// gulp.task('del',function () {
//     del('dist');                               // 构建前先删除dist文件里的旧版本
// })


gulp.task('default',['del'], function () {
    var jsFilter = filter('**/*.js',{restore:true}),
        cssFilter = filter('**/*.css',{restore:true}),
        htmlFilter = filter(['**/*.html'],{restore:true});
    gulp.src('src/*.html')
        // .pipe(useref())                         // 解析html中的构建块
        .pipe(jsFilter)                         // 过滤所有js
        .pipe(uglify())                         // 压缩js
        // .pipe(jsFilter.restore)
        .pipe(cssFilter)                        // 过滤所有css
        .pipe(csso())                           // 压缩优化css
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
    del('dist');                               // 构建前先删除dist文件里的旧版本
})