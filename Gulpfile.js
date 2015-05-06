'use strict';
var path = require('path');
var gulp = require('gulp');
var RevAll = require('gulp-rev-all');
var $ = require('gulp-load-plugins')();
var pkg = require('./package.json');

var app = {
  //static: 'http://7xj4ee.com1.z0.glb.clouddn.com/',
  static: '/',
  src: '_frontend/',
  components: '_frontend/bower_components/',
  //dist: '_dist/',
  dist: '_site/',
  site: '_site/',
  tmp: '.tmp/',
  env: 'dev'
};

gulp.task('env:prod', function () {
  app.env = 'prod';
});

gulp.task('clean', function (callback) {
  var del = require('del');
  var map = [
    app.tmp,
    app.dist + 'fonts/',
    app.dist + 'images/',
    app.dist + 'styles/',
    app.dist + 'scripts/'
  ];
  return del(map, {force: true}, callback);
});

gulp.task('jshint', function () {
  return gulp.src(app.src + 'scripts/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')));
});

gulp.task('watch', function () {
  gulp.watch([app.src + 'lesses/**/*.less'], ['less', 'reload']);
  gulp.watch([app.src + '*.html'], ['reload']);
  gulp.watch([app.src + 'scripts/*.js'], ['jshint', 'reload']);
});

gulp.task('connect', function () {
  $.connect.server({
    root: app.env == 'dev' ? app.src : app.site,
    port: 4000,
    livereload: true
  });
});

gulp.task('reload', function () {
  gulp.src('*.html')
    .pipe($.connect.reload());
});

gulp.task('font', function () {
  var dist = app.env == 'dev' ? app.src : app.dist;
  gulp.src(app.components + 'font-awesome/fonts/*')
    .pipe(gulp.dest(dist + 'fonts'))
    .pipe($.size());

  if (app.env == 'prod') {
    gulp.src(app.src + '/fonts/*')
      .pipe(gulp.dest(app.dist + 'fonts'))
      .pipe($.size());
  }
});

gulp.task('image', function () {
  gulp.src(app.src + 'images/*')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(app.dist + 'images'))
    .pipe($.size());
});

gulp.task('less', function () {
  return gulp.src(app.src + 'lesses/*.less')
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe(gulp.dest(app.src + 'styles/'))
    .pipe($.size());
});

gulp.task('useref', ['less'], function () {
  var assets = $.useref.assets();
  var revAll = new RevAll({
    dontRenameFile: ['.html'] ,
    prefix: '/',
    transformFilename: function (file, hash) {
      var ext = path.extname(file.path);
      return hash.substr(0, 8) + '.'  + path.basename(file.path, ext) + ext;
    }
  });
  return gulp.src(app.src + 'index.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(revAll.revision())
    .pipe($.if('*.js', gulp.dest(app.dist)))
    .pipe($.if('*.css', gulp.dest(app.dist)))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(app.tmp));
});

gulp.task('final', ['useref'], function () {
  var manifest = require('./' + app.tmp + 'rev-manifest.json');
  return gulp.src([app.site + '{pages,posts}/**/*.html', app.site + '*.html'])
    .pipe($.fingerprint(manifest))
    .pipe($.replace(/(href|src){1}="(styles|scripts){1}/ig, '$1="' + app.static + '$2'))
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(app.site));
});

gulp.task('serve', ['jshint', 'less', 'font', 'connect', 'watch']);

gulp.task('build', ['env:prod', 'jshint', 'clean'], function() {
  return gulp.start('final', 'font', 'image');
});

gulp.task('prod', ['env:prod', 'connect']);
