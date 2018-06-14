const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const clean_css = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const svgmin = require('gulp-svgmin');

const typescript = require('gulp-typescript');

var paths = {
  "src_dir" : './src/',
  "dist_dir" : './dist/',

  "src_html" : './src/' + '*.html',

  "src_css" : './src/' + 'css/',
  "src_style_scss" : './src/' + 'css/' + 'style.scss',
  "dist_css" : './dist/' + 'css/',
  
  "src_js" : './src/' + 'js/',
  "src_concat" : './src/' + 'js/' + '*.js',
  "src_js_main" : './src/' + 'js_main/',
  "src_uglify" : './src/' + 'js_main/' + 'main.js',
  "dist_js" : './dist/' + 'js/',

  "src_image" : './src/' + 'image/',
  "src_image_jpg" : './src/' + 'image/' + '*.+(jpg)',
  "src_image_png" : './src/' + 'image/' + '*.+(png)',
  "src_image_svg" : './src/' + 'image/' + '*.+(svg)',
  "src_image_min" : './src/' + 'image_min/',
  "dist_image" : './dist/' + 'image/',
}

var watchPaths = [
  paths["src_html"],
  paths["src_css"],
  paths["src_css"],
  paths["src_concat"],
  paths["src_uglify"],
  paths["src_image_jpg"],
  paths["src_image_png"],
  paths["src_image_svg"],
];

var tasks = []; // pushしていく

/// HTML tasks ----------------

gulp.task('html', function () {
  return gulp.src(paths["src_html"])
    .pipe(plumber())
    .pipe(gulp.dest(paths["dist_dir"]));
})

tasks.push('html');

/// CSS tasks ----------------

gulp.task('sass', function () {
  return gulp.src(paths["src_style_scss"])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded'
      })
      .on('error', sass.logError)
    )
    .pipe(autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
    }))   
    .pipe(sourcemaps.write('.'))
    .pipe(clean_css())
    .pipe(rename("./style.css"))
    .pipe(gulp.dest(paths["dist_css"]));
});

gulp.task('css', ['sass']);
tasks.push('css');

/// JS tasks ----------------

gulp.task('js.concat', function() {
  return gulp.src(paths["src_concat"])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths["src_js_main"]));
});

gulp.task('js.uglify', function() {
  return gulp.src(paths["src_uglify"])
    .pipe(plumber())
    .pipe(uglify('main.min.js'))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('js', ['js.concat', 'js.uglify']);
tasks.push('js');

/// Image tasks ----------------

gulp.task('imagemin.jpg', function(){
  gulp.src(paths["src_image_jpg"])
    .pipe(plumber())
    .pipe(imagemin([mozjpeg({quality: 80})]))
    .pipe(gulp.dest(paths["src_image_min"]))
    .pipe(gulp.dest(paths["dist_image"]));
});

gulp.task('imagemin.png', function(){
  gulp.src(paths["src_image_png"])
    .pipe(plumber())
    .pipe(imagemin([pngquant({quality: '65-80', speed: 1})]))
    .pipe(imagemin())
    .pipe(gulp.dest(paths["src_image_min"]))
    .pipe(gulp.dest(paths["dist_image"]));
});

gulp.task('imagemin.svg', function(){
  gulp.src(paths["src_image_svg"])
    .pipe(plumber())
    .pipe(svgmin())
    .pipe(gulp.dest(paths["src_image_min"]))
    .pipe(gulp.dest(paths["dist_image"]));
});

gulp.task('imagemin', ['imagemin.jpg', 'imagemin.png', 'imagemin.svg']);
tasks.push('imagemin');

/// Default task

gulp.task('default', () => {
  console.log('default');
  gulp.watch(watchPaths, tasks);
});