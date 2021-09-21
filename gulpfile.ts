import {exec} from "child_process";
import * as del from "del";
import * as gulp from 'gulp'
import * as fs from "fs";
import * as archiver from "archiver";

gulp.task('clean', () => {
  return del([
    'dist'
  ])
})

gulp.task('build:angular', (cb) =>
  exec("ng build", (error, stdout, stderr) => {
    console.info(stdout);
    console.error(stderr);
    cb(error)
  })
)

gulp.task('build:compress', () => {
    const output = fs.createWriteStream('dist.zip');
    const archive = archiver('zip').directory('dist', false)
    archive.pipe(output)
    return archive.finalize()
  }
)

export const build = gulp.series('clean', 'build:angular', 'build:compress')
