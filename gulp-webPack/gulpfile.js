const gulp = require('gulp');
const webpack = require('webpack-stream');
gulp.task('default', function() {
	return gulp.src('src/**/*.js')
		.pipe(webpack({
			
			
			resolve: {
				extensions: ['', '.js']
			},
			module: {
				loaders: [{
					test: /\.js$/,
					loader: 'babel-loader',
					query: {
						presets: ['es2015']
					}
				}]
			}
		}))
		.pipe(gulp.dest('dist/'));
});