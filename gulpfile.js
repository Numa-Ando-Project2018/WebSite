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
const browser_sync = require('browser-sync');

const gulp_typescript = require('gulp-typescript');

var paths = {
  "src_dir" : './src/',
  "dist_dir" : './dist/',

  "src_html" : './src/' + '*.html',

  "src_css" : './src/' + 'css/',
  "src_style_scss" : './src/' + 'css/' + '*.scss',
  "dist_css" : './dist/' + 'css/',
  
  "src_js" : './src/' + 'js/',
  "src_concat" : './src/' + 'js/' + '*.js',
  "src_js_main" : './src/' + 'js_main/',
  "src_uglify" : './src/' + 'js_main/' + 'main.js',
  "dist_js" : './dist/' + 'js/',

  "src_ts" : './src/' + 'ts',

  "src_image" : './src/' + 'image/',
  "src_image_jpg" : './src/' + 'image/' + '*.+(jpg)',
  "src_image_png" : './src/' + 'image/' + '*.+(png)',
  "src_image_svg" : './src/' + 'image/' + '*.+(svg)',
  "src_image_min" : './src/' + 'image_min/',
  "dist_image" : './dist/' + 'image/',
}

var watchPaths = {
  "html_path" : paths["src_html"],       //"html_task" : '',
  "css_path"  : paths["src_style_scss"], //"css_task"  : '',
  "js_path"   : paths["src_concat"],     //"js_task"   : '',
  "jpg_path"  : paths["src_image_jpg"],  //"jpg_task"  : '',
  "png_path"  : paths["src_image_png"],  //"png_task"  : '',
  "svg_path"  : paths["src_image_svg"],  //"svg_task"  : '',
};

/// HTML tasks ----------------

gulp.task('html', function () {
  return gulp.src(paths["src_html"])
    .pipe(plumber())
    .pipe(gulp.dest(paths["dist_dir"]));
})
watchPaths['html_task'] = ['html'];

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
watchPaths['css_task'] = ['css'];

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
watchPaths['js_task'] = ['js'];

/// TS tasks

gulp.task('ts', function() {
    return gulp.src(paths["src_ts"])
        .pipe(gulp_typescript({
            target: 'ES5',
            removeComments: true
        }))
        .js.pipe(gulp.dest(paths["src_concat"]));
});

/// Image tasks ----------------

gulp.task('imagemin.jpg', function(){
  gulp.src(paths["src_image_jpg"])
    .pipe(plumber())
    .pipe(imagemin([mozjpeg({quality: 80})]))
    .pipe(gulp.dest(paths["src_image_min"]))
    .pipe(gulp.dest(paths["dist_image"]));
});
watchPaths['jpg_task'] = ['imagemin.jpg'];

gulp.task('imagemin.png', function(){
  gulp.src(paths["src_image_png"])
    .pipe(plumber())
    .pipe(imagemin([pngquant({quality: '65-80', speed: 1})]))
    .pipe(imagemin())
    .pipe(gulp.dest(paths["src_image_min"]))
    .pipe(gulp.dest(paths["dist_image"]));
});
watchPaths['png_task'] = ['imagemin.png'];

gulp.task('imagemin.svg', function(){
  gulp.src(paths["src_image_svg"])
    .pipe(plumber())
    .pipe(svgmin())
    .pipe(gulp.dest(paths["src_image_min"]))
    .pipe(gulp.dest(paths["dist_image"]));
});
watchPaths['svg_task'] = ['imagemin.svg'];

/// browser-sync

// gulp.task('browser-sync', function() {
//   return browser_sync.init(null, {
//       server: './dist/index.html'
//   });
// });
// tasks.push('browser-sync');

/// Default task

gulp.task('default', () => {
  console.log('default');
  gulp.watch(watchPaths['html_path'], watchPaths['html_task']);
  gulp.watch(watchPaths['css_path'],  watchPaths['css_task']);
  gulp.watch(watchPaths['js_path'],   watchPaths['js_task']);
  gulp.watch(watchPaths['jpg_path'],  watchPaths['jpg_task']);
  gulp.watch(watchPaths['png_path'],  watchPaths['png_task']);
  gulp.watch(watchPaths['svg_path'],  watchPaths['svg_task']);
});