/*
  watch.js
  ===========
  watches sass/js/images
*/

const gulp = require('gulp')

const config = require('./config.json')

gulp.task('watch-sass', function () {
  return gulp.watch([config.paths.assets + 'sass/**', config.paths.components + '/**/*.scss'], { cwd: './' }, gulp.task('sass'))
})

gulp.task('watch-assets', function () {
  return gulp.watch([config.paths.assets + 'images/**',
    config.paths.assets + 'javascripts/**'], { cwd: './' }, gulp.task('copy-assets'))
})

gulp.task('watch-component-assets', function () {
  return gulp.watch([config.paths.components + '/**/*.js'], { cwd: './' }, gulp.task('copy-component-assets'))
})
