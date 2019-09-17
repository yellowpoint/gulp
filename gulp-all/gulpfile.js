var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),			//压缩图片
    htmlmin = require('gulp-htmlmin'),				//压缩html
    autoprefixer = require('gulp-autoprefixer'),	//自动添加css前缀
    cssver = require('gulp-make-css-url-version'); 	//添加版本号
    cssmin = require('gulp-clean-css');				//压缩css
    concat = require('gulp-concat'),				//合并js
    uglify = require('gulp-uglify'),				//压缩js
    rename = require('gulp-rename');				//修改文件名字


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
    gulp.src(srcCss)
    	.pipe(cssver())
        .pipe(cssmin())
        .pipe(gulp.dest(distCSS));
});

gulp.task('html', function () {
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
        .pipe(htmlmin(options))
        // .pipe(rename({suffix: '.min'})) //分别添加.min
        .pipe(gulp.dest(distHtml));
});

gulp.task('js', function () {

    // gulp.src(srcJs)
    //     .pipe(concat('all.js'))//合并后的文件名
    //     .pipe(gulp.dest(distJs));

    gulp.src(srcJs)
        .pipe(uglify())
        .pipe(gulp.dest(distJs));
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

// gulp.task('default', ['js', 'css', 'img', 'html', 'auto']);

//取消图片和自动
gulp.task('default', ['js', 'css', 'html']);

