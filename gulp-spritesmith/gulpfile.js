var gulp=require("gulp"),
    spritesmith=require('gulp.spritesmith');

gulp.task('default', function () {

    return gulp.src('src/images/*.*')//需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'images/questionnaire/sprite.png',//保存合并后图片的地址
            cssName: 'sprite.css',//保存合并后对于css样式的地址
            padding:5,//合并时两个图片的间距
            algorithm: 'binary-tree',//注释1
            cssTemplate: function (data) {
                var arr=[];
                data.sprites.forEach(function (sprite) {
                    arr.push(".icon-"+sprite.name+
                    "{" +
                    "background-image: url('"+sprite.escaped_image+"');"+
                    "background-position: "+sprite.offset_x/54*.36+"rem "+sprite.offset_y/54*.36+"rem;"+


                    "}\n");
                });
                return arr.join("");
            }

        }))
        .pipe(gulp.dest('dist/'));
});