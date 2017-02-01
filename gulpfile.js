//include gulp, sass, browserSync, autoprefixer, gulp-clean, gulp-concat, browserify
//install jquery,bootstrap and mustache via npm install --save-dev XXX
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var reload = browserSync.reload;

//setup sourcepaths and app path so don't need to keep typing them
var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  htmlPartialSource: 'src/partial/*.html',
  jsSource: 'src/js/**',
  imgSource: 'src/img/**'
}

var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
}


/*  START PRODUCTION TASKS */

//to run type: gulp compress - used as separate task not every time
gulp.task('compress', function() {
  return gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest(APPPATH.js));
});

//to run type: gulp compresscss - used as separate task not every time
gulp.task('compresscss', function() {
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;
  sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

    return merge(sassFiles, bootstrapCSS)
      .pipe(concat('app.css'))
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(APPPATH.css));
});

//to run type: gulp minifyHtml - used as separate task not every time
gulp.task('minifyHtml', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest(APPPATH.root));
});


/*  END PRODUCTION TASKS */

//copy js files and delete them if deleted from source, also conact them into one and include the required files install via npm
gulp.task('scripts', ['clean-scripts'], function() {
  return gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
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

//inject partials into html
gulp.task('html', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(APPPATH.root));
});

//setup sass task to conver scss to css and autoprefixer will add -webkit-(etc) prefixes for CSS3 where needed!
//merge sass and bootstrap files and concat into app.css
gulp.task('sass', function() {
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;
  sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

    return merge(sassFiles, bootstrapCSS)
      .pipe(concat('app.css'))
      .pipe(gulp.dest(APPPATH.css));
});

//checks for newer images in the cource folder, minifies them then copies them to app
gulp.task('images', function() {
  return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img));
});


//copy the fonts folder
gulp.task('moveFonts', function() {
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(APPPATH.fonts));
})

// //copy any html files from source to app and delete them if deleted from source
// gulp.task('copy', ['clean-html'], function() {
//   gulp.src(SOURCEPATHS.htmlSource)
//     .pipe(gulp.dest(APPPATH.root))
// });

//setup serve task to launch server as soon as run gulp
gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir: APPPATH.root
    }
  })
});

//setup watch task to update the server if any sass files change - server will automatically update html changes
gulp.task('watch', ['serve', 'sass', 'html', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts','images'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  //gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);  
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html']); 

});

// running watch so serve and sass will run as well
gulp.task('default', ['watch']);

//to run production type: gulp production
gulp.task('production', ['minifyHtml', 'compresscss', 'compress']);
