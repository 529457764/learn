var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var less = require('gulp-less');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');//css加prefix
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoprefix = new LessPluginAutoPrefix({
    //browsers: ['last 2 version', '> 5%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4', 'Firefox <=20', 'Opera >=1'],
    browsers: ['last 2 version', '> 5%', 'safari > 5','chrome > 35', 'ff > 10', 'opera > 10', 'ie > 6'],
    cascade: false
});
var del = require('del');
var spritesmith = require("gulp.spritesmith");
var filter = require('gulp-filter');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var wiredep = require('gulp-wiredep');

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
gulp.task('clean', function(cb) {
    del([DISTSRC+'**/*'], cb);
});
//2.编译less，并压缩css
gulp.task('minifyCss', function() {
    return gulp.src(APP.less+'**/*.less')
        //监控less文件变化
        // .pipe(watch(APP.less+'**/*.less'))
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less({
            plugins: [autoprefix]
        }))
        // .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(Dist.css))
        .pipe(reload({stream:true}));
});
//3.压缩js
gulp.task('minifyJs', function() {
    return gulp.src(APP.script+'**/*.js')
        // .pipe(watch(APP.script+'**/*.js'))
        // .pipe(plumber())
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(Dist.script))
        .pipe(reload({stream:true}));
});
//4.把html文件复制到dist中
gulp.task('copyHtml', function() {
    return gulp.src(APP.dir+'**/*.html')
        .pipe(wiredep({
            bowerJson: require('./bower.json')
        }))
        .pipe(gulp.dest(Dist.dir))
        .pipe(reload({stream:true}));
});
//5.生成spite图和对应的css文件
gulp.task('sprite', function() {
    gulp.src(APP.sprite+'**/*.png') // source path of the sprite images
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
// gulp.task('browser-sync', ['minifyCss', 'minifyJs', 'copyHtml', 'copyImages', 'sprite', 'copyLibs'], function() {
   gulp.task('browser-sync', ['minifyCss', 'minifyJs', 'copyHtml', 'copyImages', 'copyLibs'], function() {
    browserSync.init({
            server: {
                baseDir: './dist'
            }
        });
    gulp.watch(APP.less+'**/*.less', ['minifyCss']);
    gulp.watch(APP.script+'**/*.js', ['minifyJs']);
    gulp.watch(APP.dir+'**/*.html', ['copyHtml']);
    // gulp.watch([APP.dir+'**/*.html', APP.less+'**/*.less', APP.script+'**/*.js']).on('change', reload);
    gulp.watch(APP.images+'**/*', ['copyImages']);
    // gulp.watch(APP.sprite+'**/*', ['sprite']);
    gulp.watch(APP.libs+'**/*', ['copyLibs']);

});

gulp.task('default', ['browser-sync'], function() {
    
});

gulp.task('bower', function () {
  gulp.src('app/test.html')
    .pipe(wiredep({
        bowerJson: require('./bower.json')
    }))
    .pipe(gulp.dest('dist'));
});