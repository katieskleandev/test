let gulp = require('gulp')
let child = require('child_process')
let htmlmin = require('gulp-htmlmin')
let cleanCSS = require('gulp-clean-css')
let uglify = require('gulp-uglifyjs')
let ghPages = require('gulp-gh-pages')

gulp.task('default', ['jekyll-serve'])

gulp.task('jekyll-serve', (gulpCallBack) => {
  let jekyll = child.spawn('jekyll', ['serve', '--config', 'jekyll/_config.yml'])

  jekyll.stdout.on('data', (buffer) => process.stdout.write(buffer.toString()))
  jekyll.stderr.on('data', (buffer) => process.stderr.write(buffer.toString()))
  jekyll.on('exit', (code) => {
    gulpCallBack(code === 0 ? null :'Jekyll process exited with code: ' + code)
  })
})

gulp.task('jekyll-build', (gulpCallBack) => {
  let jekyll = child.spawn('jekyll', ['build', '--config', 'jekyll/_config.yml,jekyll/_production_config.yml'])

  jekyll.stdout.on('data', (buffer) => process.stdout.write(buffer.toString()))
  jekyll.stderr.on('data', (buffer) => process.stderr.write(buffer.toString()))
  jekyll.on('exit', (code) => {
    gulpCallBack(code === 0 ? null :'Jekyll process exited with code: ' + code)
  })
})

gulp.task('minify', ['minify-html', 'minify-css', 'minify-js'])

gulp.task('minify-html', ['jekyll-build'], () => {
  return gulp.src('dist/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true, minifyJS: true, minifyCSS: true}))
    .pipe(gulp.dest('dist'))
})

gulp.task('minify-css', ['jekyll-build'], () => {
  return gulp.src('dist/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'))
})

gulp.task('minify-js', ['jekyll-build'], () => {
  return gulp.src('dist/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('build', ['minify'])

gulp.task('deploy', ['build'], () => {
  return gulp.src('dist/**/*')
    .pipe(ghPages({branch: 'master'}))
})