const browserSync = require('browser-sync');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const PORT = process.env.PORT || 3000;

const reload = () => {
    browserSync.reload();
};

gulp.task('browsersync', () => {
    browserSync.init(null, {
        files: ['app.js', 'views/**/*.*', 'public/**/*.*', 'routes/**/*.*', 'models/**/*.*'],
        proxy: `http://localhost:8080`,
        port: PORT,
        open: false,
        notify: false,
    });
});

gulp.task('serve', ['browsersync'], () => {
    nodemon({
        script: './bin/www',
        ext: 'js pug',
        ignore: [
            'node_modules',
            'bin',
            'views',
            'public',
            'sources',
        ],
        env: {
            'NODE_ENV': process.env.NODE_ENV || 'development',
            'PORT': '8080',
            // 'DEBUG': 'ppark-demo-school.v2:*',
            // 'NODE_PATH': '.',
        },
        stdout: false,
    }).on('readable', function() {
        this.stdout.on('data', (chunk) => {
            if(/^Express\ server\ listening/.test(chunk)) {
                reload();
            }
            process.stdout.write(chunk);
        });
        this.stderr.on('data', (chunk) => {
            process.stderr.write(chunk);
        });
    });
});

gulp.task('dev', ['serve']);
