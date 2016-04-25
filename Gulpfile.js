// website/Gulpfile.js

var gulp = require('gulp')
var template = require('gulp-template')
var awspublish = require('gulp-awspublish')
var deps = require('deps.json')

gulp.task('build', function () {
  return gulp.src('src/**/*').pipe(template(deps))
                             .pipe(gulp.dest('dist'))
})

gulp.task('deploy', ['build'], function () {
  var publisher = awspublish.create({
    region: deps.region,
    params: {
      Bucket: deps.bucket
    }
  }, {})

  return gulp.src('dist/**/*').pipe(awspublish.gzip({}))
                              .pipe(publisher.publish({}, {force: true}))
                              .pipe(awspublish.reporter())
})

