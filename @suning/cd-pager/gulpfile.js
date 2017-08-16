var gulp = require('gulp'), //gulp
	browserSync = require('browser-sync'), //实时刷新
	sass = require('gulp-ruby-sass'), //sass编译，注：需要安装ruby和sass
	autoprefix = require('gulp-autoprefixer'), //浏览器前缀自动补齐
	watch = require('gulp-watch'), //watch修复gulp.watch不可监听新建文件的bug
	del = require('del'); //文件删除

var ejs = require('gulp-ejs'); //ejs模板
var gutil = require('gulp-util'); //ejs error log

var open_ejs = false; //是否开启ejs编译
var open_scss = true; //是否开启scss编译

gulp.task('default', () => {
	//server
	browserSync({
		files: 'src/**/*.(css|js|html)',
		browser: '',
		server: {
			baseDir: './'
		},
		startPath: 'example.html',
		open: 'external.html'
	});

	//watch sass
	watch('src/**/*.scss', function () {
		sass('src/*.scss')
			.on('error', sass.logError)
			.pipe(autoprefix())
			.pipe(gulp.dest('src/'));
	})
	// watch('src/**/*.js', function () {
	// 	gulp.src('src/**/*.js')
	// 		.pipe(gulp.dest('dist/'))
	// })

	//watch ejs
	if (open_ejs) {
		watch('src/**/*.ejs', function () {
			gulp.src('src/!(images|libs)/*.ejs')
				.pipe(ejs({}, {
					ext: '.html'
				}).on('error', gutil.log))
				.pipe(gulp.dest('src/'));
		})
	}

})

gulp.task('del', () => {
	return del(['dist/**'])
})

gulp.task('sass', ()=>{
	return sass('src/*.scss')
		.on('error', sass.logError)
		.pipe(autoprefix())
		.pipe(gulp.dest('dist/'));
})

gulp.task('build', ['del', 'sass'], () => {
	gulp.src('src/**/*.+(html|js|css|png|jpg|gif|eot|svg|ttf|woff)')
		.pipe(gulp.dest('dist/'))

})