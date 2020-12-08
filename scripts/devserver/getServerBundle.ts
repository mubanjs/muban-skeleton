import fs from 'fs';
import { resolve } from "path";
import webpack from 'webpack';
import Memoryfs from 'memory-fs';
import requireFromString from 'require-from-string';

const compileInMemory = true;

const serverCompiler = webpack(require(resolve(__dirname, './webpack.config.js')));
let outputFs;
if (compileInMemory) {
  outputFs = new Memoryfs();
  serverCompiler.outputFileSystem = outputFs;
}

function getBundle() {
  const thisFs = compileInMemory ? outputFs : fs;
  const outputPath = resolve(__dirname, './output/main.js');
  if (thisFs.existsSync(outputPath)) {
    const fileContent = thisFs.readFileSync(outputPath)
      .toString();
    return requireFromString(fileContent);
  }
}

const watcher = serverCompiler.watch({}, (err, stats) => {
  // if (err) {
  //   return console.error('[Error]', err);
  // }
  console.log(stats.toString({ colors: true}));
  templateFile = getBundle();
  // console.log('templateFile', templateFile);
})

let templateFile = null;


export function waitForCompile(): Promise<void> {
  if (!watcher.running) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    setInterval(() => {
      if (!watcher.running) {
        resolve();
      }
    }, 10);
  });
}

export async function getPageData(pagePath: string): Promise<Record<string, any>> {
  await waitForCompile();

  const getPage = (pageId) => {
    if (templateFile.pages[pageId]) {
      return templateFile.pages[pageId];
    }
    if (templateFile.pages['index']) {
      return templateFile.pages['index'];
    }

    return {
      default: () => 'auto index',
      data: () => ({ blocks: [] }),
    }
  }
  return getPage(pagePath.slice(1)).data();
}

export async function getAppTemplate(pageData): Promise<string> {
  await waitForCompile();

  console.log('templateFile', templateFile);

  return templateFile.appTemplate(pageData)
}