'use strict';

var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var pkg = require('./package.json');

var app = {
  src: '_frontend/',
  components: '_frontend/bower_components/',
  dist: '_site/',
  tmp: '.tmp/',
  env: 'dev'
};

gulp.task('env:prod', function () {
  app.env = 'prod';
});

gulp.task('clean', function (callback) {
  var del = require('del');
  var map = [
    app.tmp
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
    root: app.env == 'dev' ? app.src : app.dist,
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
    .pipe($.autoprefixer('last 2 versions'))
    .pipe(gulp.dest(app.src + 'styles/'))
    .pipe($.size());
});

gulp.task('usemin', ['less'], function () {
  return gulp.src(app.src + 'index.html')
    .pipe($.usemin({
      css: ['concat', $.csso()],
      js: [$.uglify()]
    }))
    .pipe(gulp.dest(app.dist))
    .pipe($.size());
});

/*gulp.task('rev', ['usemin'], function () {
  var RevAll = require('gulp-rev-all');
  var revAll = new RevAll({
    fileNameManifest: 'manifest.json',
    transformFilename: function (file, hash) {
      var ext = path.extname(file.path);
      return hash.substr(0, 8) + '.'  + path.basename(file.path, ext) + ext;
    }
  });
  return gulp.src([app.tmp + 'styles/*', app.tmp + 'scripts/*'])
    .pipe(revAll.revision())
    .pipe(gulp.dest(app.dist))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(app.tmp));
});*/

//gulp.task('replace', ['rev'], function () {
//  var manifest = require('./' + app.tmp + 'manifest.json');
//  return gulp.src([app.dist + '{pages,posts}/**/*.html', app.dist + '*.html', app.tmp+'*.html'])
//    .pipe($.fingerprint(manifest))
//    .pipe(gulp.dest(app.dist));
//});

gulp.task('htmlmin', ['usemin'], function () {
  gulp.src([app.dist + '{pages,posts}/**/*.html', app.dist + '*.html'])
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(app.dist))
    .pipe($.size());
});

gulp.task('serve', ['jshint', 'less', 'font', 'connect', 'watch']);

gulp.task('build', ['env:prod', 'jshint', 'clean'], function() {
  return gulp.start('htmlmin', 'font', 'image');
});

gulp.task('prod', ['env:prod', 'connect']);
