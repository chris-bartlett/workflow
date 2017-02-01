//include gulp, sass, browserSync, autoprefixer, gulp-clean
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var reload = browserSync.reload;

//setup sourcepaths and app path so don't need to keep typing them
var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/*.js'
}

var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}

//copy js files and delete them if deleted from source
gulp.task('scripts', ['clean-scripts'], function() {
  return gulp.src(SOURCEPATHS.jsSource)
    .pipe(gulp.dest(APPPATH.js));
});

//clean removes deleted html files from app that have been removed from source
gulp.task('clean-html', function() {
  return gulp.src(APPPATH.root + '/*.html', {read: false, force: true})
    .pipe(clean());
});

//clean removes deleted js files from app that have been removed from source
gulp.task('clean-scripts', function() {
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
    .pipe(clean());
});

//setup sass task to conver scss to css and autoprefixer will add -webkit-(etc) prefixes for CSS3 where needed!
gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.css));
});

//copy any html files from source to app and delete them if deleted from source
gulp.task('copy', ['clean-html'], function() {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root))
});

//setup serve task to launch server as soon as run gulp
gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir: APPPATH.root
    }
  })
});

//setup watch task to update the server if any sass files change - server will automatically update html changes
gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);    

});

// running watch so serve and sass will run as well
gulp.task('default', ['watch']);
