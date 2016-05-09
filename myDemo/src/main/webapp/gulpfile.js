var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var less = require('gulp-less');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');//css加prefix
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var del = require('del');
var spritesmith = require("gulp.spritesmith");
var filter = require('gulp-filter');

var DISTSRC = "dist/";
var APPSRC = "app/";
var Dist = {
    dir: DISTSRC,
    html: DISTSRC + "html/",
    css: DISTSRC + "css/",
    script: DISTSRC + "script/",
    images: DISTSRC + "images/",
    sprite: DISTSRC + "images/sprite/",
    libs: DISTSRC + "libs/"
};
var APP = {
    dir: APPSRC,
    html: APPSRC + "html/",
    less: APPSRC + "less/",
    script: APPSRC + "script/",
    images: APPSRC + "images/",
    sprite: APPSRC + "images/sprite/",
    libs: APPSRC + "libs/"
};

//1.删除dist中所有的文件
gulp.task('clean:dist', function(cb) {
    del([DISTSRC+'**/*'], cb);
});
//2.编译less，并压缩css
gulp.task('minifyCss', function() {
    return gulp.src(APP.less+'**/*.less')
        // pipe(plumber())
        //监控less文件变化
        // .pipe(watch(APP.less+'**/*.less'))
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(Dist.css))
        .pipe(reload({stream:true}));
});
//3.压缩js
gulp.task('minifyJs', function() {
    return gulp.src(APP.script+'**/*.js')
        // .pipe(watch(APP.script+'**/*.js'))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(Dist.script))
        .pipe(reload({stream:true}));
});
//4.把html文件复制到dist中
gulp.task('copyHtml', function() {
    return gulp.src(APP.dir+'**/*.html')
        .pipe(gulp.dest(Dist.dir))
        .pipe(reload({stream:true}));
});
//5.生成spite图和对应的css文件
gulp.task('sprite', function() {
    return gulp.src(APP.sprite+'**/*.png') // source path of the sprite images
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            algorithm: 'binary-tree'//存放的样式，有top-down,left-right,binary-tree，默认是binary-tree
        }))
        .pipe(gulp.dest(Dist.sprite));
});
//素材图片放入dist
gulp.task('copyImages', function() {
    return gulp.src([APP.images+'**/*', '!app/images/sprite/**/*'])
        .pipe(gulp.dest(Dist.images))
        .pipe(reload({stream:true}));
});
//插件放入dist
gulp.task('copyLibs', function() {
    return  gulp.src(APP.libs+'**/*')
        .pipe(gulp.dest((Dist.libs)))
        .pipe(reload({stream:true}));
});
//browser-sync，自动刷新页面
gulp.task('browser-sync', ['minifyCss', 'minifyJs', 'copyHtml', 'copyImages', 'copyLibs'], function() {
    browserSync.init({
            server: {
                baseDir: './dist'
            }
        });
    gulp.watch(APP.less+'**/*.less', ['minifyCss']);
    gulp.watch(APP.script+'**/*.js', ['minifyJs']);
    gulp.watch(APP.dir+'**/*.html', ['copyHtml']);
    gulp.watch(APP.images+'**/*', ['copyImages']);
    gulp.watch(APP.libs+'**/*', ['copyLibs']);

});

gulp.task('default', ['browser-sync'], function() {

});