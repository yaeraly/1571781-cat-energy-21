const del = require("del");
const gulp = require("gulp");
const less = require("gulp-less");
const webp = require("gulp-webp");
const csso = require("postcss-csso");
const sync = require("browser-sync").create();
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const htmlmin = require("gulp-htmlmin");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const cheerio = require("gulp-cheerio");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const sourcemap = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");
const { svgo } = require("gulp-imagemin");

// Clean (Delete "build" Directory)

const clean = () => {
  return del("build")
}

exports.clean = clean;

// Copy FONTS and IMAGES to "build".
// If "build" does not exist it creates a dirctory "build"

const copy = () => {
  return gulp.src([
    "source/img/*.{png,jpg,svg}",
    "source/fonts/*.{woff,woff2}",
  ],
  {
    base: "source"
  })
    .pipe(gulp.dest("build/"))
}

exports.copy = copy;

// Minify Images (JPEG and PNG)
// If "build" does not exist it creates a dirctory "build"

const minifyImages = () => {
  return gulp.src("source/img/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 4}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img/"))
}

exports.minifyImages = minifyImages;

// Convert JPEG and PNG into Webp and minify Webp

const makeWebp = () => {
  return gulp.src("source/img/*.{png,jpg}")
    .pipe(webp({quality: 50}))
    .pipe(gulp.dest("build/img/"))
}

exports.makeWebp = makeWebp;

// Combine SVG files

const sprite = () => {
  return gulp.src("source/img/icon/*.svg")
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {removeUselessStrokeAndFill: true}
      ]
      })
    ]))
    .pipe(svgstore())
    .pipe(cheerio({
      run: function ($) {
          $('svg').attr('style',  'display:none');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/"))
}

exports.sprite = sprite;

// Minify HTML

const minifyHtml = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build/"))
    .pipe(sync.stream());
}

exports.minifyHtml = minifyHtml;

// Minify JavaScript

const minifyJs = () => {
  return gulp.src("source/js/script.js")
    .pipe(rename("script.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("build/js/"))
}

exports.minifyJs = minifyJs;

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Build

const build = gulp.series (
  // clean,
  styles,
  gulp.parallel (
    copy,
    sprite,
    minifyJs,
    minifyHtml,
    // makeWebp,
    // minifyImages
  )
);

exports.build = build;


// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change",  gulp.series("minifyHtml"));
}

exports.default = gulp.series (
  // clean,
  styles,
  gulp.parallel (
    copy,
    sprite,
    minifyJs,
    minifyHtml,
    // makeWebp,
    // minifyImages
  ),
  server,
  watcher
);
