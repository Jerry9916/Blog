'use strict';

var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var pkg = require('./package.json');

var app = {
  src: '_frontend/',
  components: '_frontend/bower_components/',
  dist: '_site/assets/',
  env: 'dev'
};

gulp.task('env:prod', function () {
  app.env = 'prod';
});

gulp.task('clean', function (callback) {
  var del = require('del');
  return del([app.dist+'**/*'], {force: true}, callback);
});

gulp.task('html', function () {
  gulp.src('*.html')
    .pipe($.connect.reload());
});

gulp.task('less', function () {
  return gulp.src(app.src + 'lesses/*.less')
    .pipe($.less())
    .pipe($.autoprefixer('last 2 versions'))
    .pipe(gulp.dest(app.src + 'styles/'))
    .pipe($.size());
});

gulp.task('jshint', function () {
  return gulp.src(app.src + 'scripts/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')));
});

gulp.task('watch', function () {
  gulp.watch([app.src + 'lesses/**/*.less'], ['less', 'html']);
  gulp.watch([app.src + '*.html'], ['html']);
  gulp.watch([app.src + 'scripts/*.js'], ['jshint', 'html']);
});

gulp.task('connect', function () {
  $.connect.server({
    root: app.env == 'dev' ? app.src : app.dist,
    port: 4000,
    livereload: true
  });
});

gulp.task('font', function () {
  var dist = app.env == 'dev' ? app.src : app.dist;
  gulp.src(app.components + 'font-awesome/fonts/*')
    .pipe(gulp.dest(dist + 'fonts'))
    .pipe($.size());
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

gulp.task('usemin', ['less'], function () {
  gulp.src(app.src + 'index.html')
    .pipe($.usemin({
      css: ['concat', $.csso()],
      js: [$.uglify()]
    }))
    .pipe(gulp.dest(app.dist))
    .pipe($.size());
});

gulp.task('serve', ['jshint', 'less', 'font', 'connect', 'watch']);

gulp.task('build', ['env:prod', 'jshint', 'clean'], function() {
  gulp.start('font', 'image', 'usemin');
});
