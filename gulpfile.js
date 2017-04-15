var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var node = require('node-dev');
var source = require('vinyl-source-stream');

function errorHandler(err) {
    console.log('Error: ' + err.message);
}

gulp.task('browser-sync',
    () => {
        browserSync({
            proxy: {
                target: 'http://localhost:3000'
            },
            port: 8080
        });
    });

gulp.task('build',
    () => {
        browserify('./react_sources/index.js')
            .transform(babelify.configure({
                presets: ['react', 'es2015']
            }))
            .bundle()
            .on('error', errorHandler)
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(gulp.dest('./public/javascripts'))
            .pipe(browserSync.reload({stream: true}));
    });

gulp.task('server',
    () => {
        node('./server.js', [], [], []);
    });

gulp.task('watch',
    () => {
        gulp.watch(['./react_sources/index.js',
                './views/*.ejs',
                './react_sources/components/*.js',
                './react_sources/models/*.js'],
            ['build']);
    });

gulp.task('default', ['server', 'build', 'watch', 'browser-sync']);