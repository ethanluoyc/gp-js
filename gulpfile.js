const gulp = require('gulp');
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const gutil = require('gulp-util');

gulp.task('webpack', function() {
  return gulp.src('src/*.jsx')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});

// gulp.task('babel', () =>
// gulp.src('src/*.js')
//     .pipe(babel({
//         presets: ['env', 'react']
//     }).on("error", console.error.bind(console)))
//     .pipe(gulp.dest('lib'))
// );

// gulp.task('watch', function() {
//     gulp.watch('src/*.js', ['webpack'])
//   });

// gulp.task('default', ['watch']);

gulp.task("webpack-dev-server", function(callback) {
  // Start a webpack-dev-server
  var compiler = webpack(require('./webpack.config.js'));
  new WebpackDevServer(compiler, {
    // server and middleware options
  }).listen(8080, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    // Server listening
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

    // keep the server alive or continue?
    // callback();
  });
});
