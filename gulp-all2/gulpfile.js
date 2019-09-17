var gulp = require('gulp'),
    del = require('del'),                           //删除文件
    imagemin = require('gulp-imagemin'),			//压缩图片
    htmlmin = require('gulp-htmlmin'),				//压缩html
    autoprefixer = require('gulp-autoprefixer'),	//自动添加css前缀
    cssver = require('gulp-make-css-url-version'); 	//添加版本号
    cssmin = require('gulp-clean-css');				//压缩css
    concat = require('gulp-concat'),				//合并js
    uglify = require('gulp-uglify'),				//压缩js
    rename = require('gulp-rename');				//修改文件名字
    useref = require('gulp-useref'),                //替换合并过的引用路径all.js/all.css
    // rev = require('gulp-rev'),                      //添加hash值
    // revReplace  = require('gulp-rev-replace'),      //重写被gulp-rev重命名的文件名
    jshint = require('gulp-jshint'),                  //语法检测
    filter = require('gulp-filter'),
    RevAll = require('gulp-rev-all');


  //设置各种输入输出文件夹的位置;主要为html、css、js、image四类为主

var srcJs = './src/js/*.js',

    distJs = './dist/js',

    srcCss = './src/css/*.css',

    distCSS = './dist/css',

    srcSass = './src/css/*.scss',

    distSass = './dist/css',

    srcImage = './src/images/*.{png,jpg,gif,ico}',

    distImage = './dist/images',

    srcHtml = './src/*.html',

    distHtml = './dist';

gulp.task('img', function () {
    del(distImage+'/*.{png,jpg,gif,ico}')
    gulp.src(srcImage)
        .pipe(imagemin({
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(distImage));
});

gulp.task('css', function () {
    del(distCSS+'/*.css')

    gulp.src(srcCss)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],      // 浏览器版本
            cascade:true,                       // 美化属性，默认true
            add: true,                           // 是否添加前缀，默认true
            remove: true,                        // 删除过时前缀，默认true
            flexbox: true                       // 为flexbox属性添加前缀，默认true
        }))
        .pipe(concat('all.css'))
        .pipe(cssmin())

        .pipe(gulp.dest(distCSS));
});


// gulp.task('js', function () {
//     del(distJs+'/*.js')
//     gulp.src(['src/js/zepto.min.js','src/js/fastclick.min.js','src/js/swiper-3.4.1.min.js','src/js/hd-common.js','src/js/hd-index.js'])
//         .pipe(concat('all.js'))
//         // .pipe(uglify())

//         .pipe(gulp.dest(distJs));
// });

gulp.task('js', function () {
    del(distJs+'/*.js')
    gulp.src(['src/js/zepto.min.js','src/js/fastclick.min.js','src/js/swiper-3.4.1.min.js','src/js/hd-common.js','src/js/hd-index.js'])
        // .pipe(concat('all.js'))
        .pipe(uglify())

        .pipe(gulp.dest(distJs));
});


gulp.task('html', function () {
    del(distHtml+'/*.html')
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(srcHtml)
        .pipe(useref())                         // 替换HTML中引用的css和js
        // .pipe(rev())                            // 给css,js,html加上hash版本号
        // .pipe(revReplace())                  // 把引用的css和js替换成有版本号的名字
        .pipe(htmlmin(options))
        .pipe(gulp.dest(distHtml));
});


//监控改动并自动刷新任务;

//命令行使用gulp auto启动;

gulp.task('auto', function() {

    gulp.watch(srcJs, ['js']);

    gulp.watch(srcCss, ['css']);

    gulp.watch(srcImage, ['img']);

    gulp.watch(srcHtml, ['html']);

});

//gulp默认任务(集体走一遍,然后开监控);

gulp.task('default', ['js', 'css', 'img', 'html', 'auto']);

