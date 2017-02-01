//include gulp, sass, browserSync
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

//setup sourcepaths and app path so don't need to keep typing them
var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss'
}

var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}

//setup sass task to conver scss to css
gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.css));
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
gulp.task('watch', ['serve', 'sass'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
});

// running watch so serve and sass will run as well
gulp.task('default', ['watch']);
