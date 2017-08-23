'use strict';

// require
var gulp    = require('gulp');
var $       = require('gulp-load-plugins')();
var runs    = require('run-sequence');
var path    = require('path');
var bsync   = require('browser-sync');
var reload  = bsync.reload;
var fs      = require('fs');


// configurable paths
var appConfig = {
    mods: 'node_modules',
    dist: 'dist',
    test: 'test',
    app: 'app'
};


// css generation from less
gulp.task('less', function () {
    return gulp.src(appConfig.app + '/css/**/*.less')
    .pipe($.less())
    .on('error', function (message) {
        console.log(message);
        this.emit('end');
    })
    .pipe(gulp.dest(appConfig.app + '/css'))
    .pipe(reload({ stream: true })); });


// html optimization
var htmlEntities = function (input, output) {
    return gulp.src(input)
    .pipe($.replace(/<link rel="stylesheet" href="css\/((.*?)\.css)"[^>]*>/g, function(tag, filename) {
        var filepath = appConfig.app + '/css/' + filename;
        var detectFile = fs.existsSync(filepath);
        
        if (detectFile) {
            var style = fs.readFileSync(filepath, 'utf8');
            return '<style>' + style + '</style>';
        } else {
            console.log('ERROR : ', filepath + ' does not exist !!!');
        }
    }))
    .pipe($.replace(/<script src="js\/((.*?)\.js)"[^>]*><\/script>/g, function(tag, filename) {
        var filepath = appConfig.app + '/js/' + filename;
        var detectFile = fs.existsSync(filepath);
        
        if (detectFile) {
            var script = fs.readFileSync(filepath, 'utf8');
            return '<script>' + script + '</script>';
        } else {
            console.log('ERROR : ', filepath + ' does not exist !!!');
        }
    }))
    .pipe(gulp.dest(output));
};

gulp.task('html', function () {
    return htmlEntities(appConfig.app + '/*.html', appConfig.dist);
});


// documents
gulp.task('documents', function () {
    return gulp.src(appConfig.app + '/doc/**/*').pipe(gulp.dest(appConfig.dist + '/app/doc'));
});


// fonts
gulp.task('fonts', function () {
    var projectFonts = gulp.src(appConfig.app + '/fonts/**/*.{eot,svg,ttf,woff,woff2}').pipe(gulp.dest(appConfig.dist + '/app/fonts'));
    
    var materialFonts = gulp.src(appConfig.mods + '/material-design-icons-dist/*.{eot,svg,ttf,woff,woff2}').pipe(gulp.dest(appConfig.dist + '/app/fonts'));
    
    return projectFonts && materialFonts;
});


// delete files and folders
gulp.task('clean', function () {
    return gulp.src([appConfig.dist]).pipe($.rimraf());
});


// build app
gulp.task('build', function () {
    runs('clean', 'less', 'html');
    // runs('clean', 'less', 'html', 'documents', 'fonts', 'dist');
});


// start app
gulp.task('serve', ['less'], function () {
    var bsync1 = bsync.create("proxy1");
    var bsync2 = bsync.create("proxy2");
    
    bsync1.init({
        notify: false,
        port: 1337,
        server: {
            baseDir: [appConfig.app],
            routes: {
                '/node_modules': appConfig.mods
            }
        },
        ui: {
            port: 3001
        }
    });
    
    bsync2.init({
        notify: false,
        port: 1338,
        server: {
            baseDir: [appConfig.test],
            routes: {
                '/node_modules': appConfig.mods,
                '/app': appConfig.app
            }
        },
        ui: {
            port: 3002
        }
    });
    
    gulp.watch([
        appConfig.app + '/*.html',
        appConfig.app + '/html/*.html',
        appConfig.app + '/doc/**/*',
        appConfig.app + '/js/**/*.js',
        appConfig.app + '/css/**/*.css',
        appConfig.test + '/*.html',
        appConfig.test + '/**/*.js'
        ]).on('change', bsync1.reload)
    .on('change', bsync2.reload);
    
    gulp.watch(appConfig.app + '/css/**/*.less', ['less']);
});


// distribution version generation
gulp.task('dist', function () {
    bsync({
        notify: false,
        port: 1337,
        server: {
            baseDir: [appConfig.dist]
        }
    });
});


// default task
gulp.task('default', ['serve']);