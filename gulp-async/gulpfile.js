var gulp = require('gulp');
var webpack = require('webpack-stream');
var named = require('vinyl-named');

gulp.task('default', function() {

	gulp.src('src/**/*.js')
		.pipe(named())
		.pipe(webpack({
			module: {
				loaders: [{
					test: /\.js/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					query: {
						presets: ['es2015'],
						plugins:["transform-runtime"]
					}
				}, ],
			},
		}))

		.pipe(gulp.dest('dist'))
});