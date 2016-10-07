import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rupture from 'rupture';
import cssnano from 'cssnano';
import gcmq from 'gulp-group-css-media-queries';
import imagemin from 'gulp-imagemin';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import uglify from 'gulp-uglify';
import lost from 'lost';
import poststylus from 'poststylus';
import autoprefixer from 'autoprefixer';
import concat from 'gulp-concat';

const dirs = {
	src:'src',
	dest:'build'
}

gulp.task('styles', ()=> {
	gulp.src('./src/stylus/main.styl')
	.pipe(plumber())
  .pipe(stylus({
    use:[
      poststylus([ autoprefixer({ browsers: ["last 3 version", "> 1%", "ie 8"] })]),
      rupture()
    ]
  }))
  .pipe(postcss([
  	lost(),
  	cssnano()
  ]))
  .pipe(gcmq())
  .pipe(gulp.dest('./build/css/'))
});


gulp.task('scripts', ()=> {
  return gulp.src('./src/js/*.js')
  // .pipe(uglify())
  //.pipe(concat('plugins.js'))
  .pipe(gulp.dest('./build/js'))
});

gulp.task('imgoptimizer', ()=> {
  return gulp.src('./src/img/*.{jpg,gif,png,svg}')
  .pipe(plumber())
  .pipe(imagemin({
    optmizationLevel: 5,
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest('./build/images/'))
});

gulp.task('watch', ()=> {
  gulp.watch('./src/stylus/*.styl', ['styles']);
  gulp.watch('./src/js/*.js', ['scripts']);
  gulp.watch('./src/img/*.{jpg,gif,png,svg}', ['imgoptimizer']);
});


gulp.task('default', ['watch','imgoptimizer']);