const gulp = require('gulp')
const babel = require('gulp-babel')

gulp.task('babel', () =>
gulp.src('src/*.js')
    .pipe(babel({
        presets: ['env', 'react']
    }).on("error", console.error.bind(console)))
    .pipe(gulp.dest('lib'))
);

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['babel'])
  });

gulp.task('default', ['watch'])
