import path from 'path';
import recursive from 'recursive-readdir';
const pagesFolder = path.resolve(__dirname, '../src/pages');

export function getAvailablePages(): Promise<Array<{ id: string, path: string }>> {
  return new Promise((resolve, reject) => {
    recursive(
      pagesFolder,
      [
        // ignore any non-ts files (but allow folders to do recursion
        (file, stats) => !stats.isDirectory() && path.extname(file) !== '.ts'
      ],
      (err, files) => {
        if (err) {
          return reject(err);
        }
        const pages = files
          .map(f => ({
            id: path.relative(pagesFolder, f).replace(path.extname(f), ''),
            path: f,
          }))
          .sort()

        // console.log('pages', pages);
        resolve(pages);
      },
    );
  });
}