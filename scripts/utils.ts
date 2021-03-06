import fs from 'fs';
import path, { resolve } from 'path';
import recursive from 'recursive-readdir';
import webpack from 'webpack';
import Memoryfs from 'memory-fs';
import requireFromString from 'require-from-string';
import { paths } from '../config/paths';

const COMPILE_IN_MEMORY = true;

let outputFs;

export function getCompiler(config) {
  const serverCompiler = webpack(config);
  if (COMPILE_IN_MEMORY) {
    outputFs = new Memoryfs();
    serverCompiler.outputFileSystem = outputFs;
  }
  return serverCompiler;
}

function getFileSystem() {
  return COMPILE_IN_MEMORY ? outputFs : fs;
}

// get an asset from the memory file system
export function getAsset(relativePath): Buffer | null {
  const thisFs = getFileSystem();

  try {
    const assetPath = path.resolve(paths.serverBundleOutputDir, relativePath);

    if (thisFs.existsSync(assetPath)) {
      return thisFs.readFileSync(assetPath);
    } else {
      return null;
    }
  } catch (e) {
    // console.error(e);
    return null;
  }
}

export function getBundleFile() {
  const thisFs = getFileSystem();
  const outputPath = paths.serverBundleOutputEntry;

  if (thisFs.existsSync(outputPath)) {
    const fileContent = thisFs.readFileSync(outputPath).toString();
    try {
      return requireFromString(fileContent);
    } catch (e) {
      console.error('Failed requiring build', e);
      return null;
    }
  } else {
    console.log('output path does not exist', outputPath);
    return null;
  }
}

export function getAvailablePages(): Promise<Array<{ id: string; path: string }>> {
  return new Promise((resolve, reject) => {
    recursive(
      paths.pagesPath,
      [
        // return true to ignore something
        (fileOrFolderPath, stats) => {
          return (
            // ignore any non-ts files (but allow folders to do recursion)
            (!stats.isDirectory() && path.extname(fileOrFolderPath) !== '.ts') ||
            // ignore any file or folder that starts with an underscore
            path.basename(fileOrFolderPath).startsWith('_')
          );
        },
      ],
      (err, files) => {
        if (err) {
          return reject(err);
        }
        const pages = files
          .map((f) => ({
            id: path.relative(paths.pagesPath, f).replace(path.extname(f), '').replace(/\\/g, '/'),
            path: f.replace(/\\/g, '/'),
          }))
          .sort();

        // console.log('pages', pages);
        resolve(pages);
      },
    );
  });
}

export function replaceTemplateVars(
  template: string,
  content: string,
  additionalVars: Record<string, string> = {},
): string {
  const toReplace = {
    ...additionalVars,
    content,
    publicPath: paths.publicPath.slice(0, -1),
  };

  return Object.entries(toReplace).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), value),
    template,
  );
}
