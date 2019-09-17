var gulp = require('gulp'),
    htmlmini = require('gulp-html-minify'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    filter = require('gulp-filter'),
    // RevAll = require('gulp-rev-all'),
    del = require('del'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    rev = require('gulp-revm'),
    revCollector = require('gulp-revm-collector'),
    GulpSSH = require('gulp-ssh'),
    changed = require('gulp-changed');




gulp.task('main', ['del'],function () {
    var jsFilter = filter(['**/*.js','!**/*.min.js'],{restore:true}),
        cssFilter = filter('**/*.css',{restore:true}),
        htmlFilter = filter(['**/*.html'],{restore:true});
    return gulp.src('src/**/*.*')
        .pipe(useref())                         // 解析html中的构建块 这个就直接合并生成了all.js、all.css
        .pipe(jsFilter)                         // 过滤所有js
        .pipe(babel())
        .pipe(uglify())                         // 压缩js，无法压缩es6的，压缩过的文件再压缩会报错
        .pipe(jsFilter.restore)					// 返回到未过滤执行的所有文件
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
        .pipe(htmlFilter)                       // 过滤所有html
        .pipe(htmlmini())                       // 压缩html
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest('rev'))

})

//删除之前生成的rev和dist文件夹
gulp.task('del',function () {
    // return del(['./rev/**/*.*','./dist/**/*.*','!./dist/img/**/*.*','!./dist/font/**/*.*']);
    return del(['./rev','./dist']);

})

// //监控改动并自动刷新任务;
// gulp.task('auto', function() {

//    return gulp.watch('src/**/*.*', ['default']);

// });

gulp.task('img', function () {
    del(['./dist/img/**/*.*']);
   return gulp.src('./src/img/**/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./dist/img'));

});

//图片压缩较耗时，单独用gulp img;

//静态文件加md5，先要rev过一遍文件，生成映射表，再revCollector替换到html，css，js里面



//这里需要是同一目录的,看来还需要是
//要用return来做同步，就把这三个分开了
// gulp.task('revFont',['main'],function(){
//     return gulp.src(['./src/font/**/*.*'])
//         .pipe(rev())
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('rev/font'));
// })

// gulp.task('revImg',['revFont'],function(){
//     return gulp.src(['./src/img/**/*.*'])
//         .pipe(rev())
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('rev/img'));
// })

// gulp.task('rev',['revImg'],function(){

// return gulp.src(['./rev/**/*.*','!./rev/**/*.html'])
//         .pipe(rev())
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('rev/main'))

// })

//这个以前不知道为什么要分开去过，反正现在就直接过全部文件就行了

gulp.task('rev',['main'],function(){

return gulp.src(['./rev/**/*.*','!./rev/**/*.html'])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/main'))

})

gulp.task('revCollector',['rev'],function(){

    return gulp.src(['./rev/**/*.json', './rev/**/*.js','./rev/**/*.html','./rev/**/*.css'])
        .pipe(changed('dist'))
        .pipe(revCollector())
        .pipe(gulp.dest('dist'));

})



// gulp.task('changed', ['revCollector'],function() {
//     return gulp.src('src/**/*.*')
//         // `changed` 任务需要提前知道目标目录位置
//         // 才能找出哪些文件是被修改过的
//         .pipe(changed('dist'))
//         // 只有被更改过的文件才会通过这里
//         .pipe(gulp.dest('changed'))
// });

gulp.task('default',['revCollector'],function () {

})





//载入配置文件
var config = require('./config.js');
var sshConfig = config.ssh;
//打开ssh通道
var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: sshConfig
});


//删除服务器的文件
gulp.task('execSSH', function() {
    // console.log('删除服务器上现有文件...');
    // return gulpSSH.shell(config.commands, {filePath: 'commands.log'})
    // .pipe(gulp.dest('logs'));

});

//上传文件到真实服务器
gulp.task('deployFile', ['execSSH'],() => {
    console.log('开始上传文件...');
    return gulp.src(['./dist/**/*.html','./dist/**/*.css','./dist/**/*.js', '!**/node_modules/**'])
    .pipe(gulpSSH.dest(config.remoteDir));

});

//上传文件到测试服务器
gulp.task('deployTestFile', ['execSSH'],() => {
    console.log('开始上传文件...');
    return gulp.src(['./dist/**/*.html','./dist/**/*.css','./dist/**/*.js', '!**/node_modules/**'])
    .pipe(gulpSSH.dest(config.remoteTestDir));

});