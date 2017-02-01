//include gulp, sass, browserSync, autoprefixer
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var reload = browserSync.reload;

//setup sourcepaths and app path so don't need to keep typing them
var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html'
}

var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}

//setup sass task to conver scss to css and autoprefixer will add -webkit-(etc) prefixes for CSS3 where needed!
gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)
  .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.css));
});

//copy any html files from source to app
gulp.task('copy', function() {
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
//watch for any change sto html files and run copy if they are updated
gulp.task('watch', ['serve', 'sass', 'copy'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy'])
});

// running watch so serve and sass will run as well
gulp.task('default', ['watch']);
