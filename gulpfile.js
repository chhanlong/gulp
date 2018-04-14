var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
//更改压缩名称
var rename = require("gulp-rename");
//对文件名加MD5后缀 - 路径替换
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
//压缩html
var htmlmin = require('gulp-htmlmin');
//定义静态文件路径
var staticsUrl = "./";
//定义文件路径
var Url = "./view/";

gulp.task('script', function() {
  return gulp.src(staticsUrl+'js/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(staticsUrl+'jsmin/'))

    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest(staticsUrl+'jsmin/json/'));
});

gulp.task('script-json', function() {
  gulp.src([staticsUrl+'jsmin/json/*.json', Url+'common/*.php'])
    //.pipe(rename({suffix: '.min'}))
    .pipe(revCollector())
    .pipe(gulp.dest(Url+'common/'));
});

gulp.task('style', function() {
  return  gulp.src(staticsUrl+'css/*.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS())
    .pipe(gulp.dest(staticsUrl+'cssmin/'))

    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest(staticsUrl+'cssmin/json/'));
});

gulp.task('style-json', function() {
  gulp.src([staticsUrl+'cssmin/json/*.json', Url+'common/*.php'])
    //.pipe(rename({suffix: '.min'}))
    .pipe(revCollector())
    .pipe(gulp.dest(Url+'common/'));
});

//压缩html
gulp.task('html', function () {
  var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    //minifyJS: true,//压缩页面JS
    //minifyCSS: true//压缩页面CSS
  };
  gulp.src(Url+'index/index.html')
    .pipe(rename({suffix: '.min'}))
    .pipe(htmlmin(options))
    .pipe(gulp.dest(Url+'index/'));
});


// 监听文件修改，当文件被修改则执行 script 任务
gulp.task('auto', function () {
  gulp.watch(staticsUrl+'js/*.js', ['script']);
  gulp.watch(staticsUrl+'css/*.css', ['style']);
  gulp.watch(Url+'index/*.html', ['html']);
});

/**
 * 需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，
 * 而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
 *
 * gulp local 本地环境不需要加hash缓存  prod 线上环境需要加hash缓存
 */

gulp.task('prod', function (done) {
  condition = false;
  runSequence(
    ['script'],
    ['script-json'],
    ['style'],
    ['style-json'],
    done);
});

gulp.task('local', function (done) {
  condition = false;
  runSequence(
    ['script'],
    ['style'],
    ['html'],
    ['auto'],
    done);
});