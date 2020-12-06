import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import Memoryfs from 'memory-fs';
import requireFromString from 'require-from-string';
import { paths } from '../config/paths';
import { getAvailablePages } from './utils';

const compileInMemory = true;
let bundlePromise = null;

async function getBundle(): Promise<{pages: Record<string, { data: () => Record<string, any> }>; appTemplate: (props: Record<string, any>) => string}> {
  if (bundlePromise) {
    return bundlePromise;
  }

  bundlePromise = new Promise((resolve, reject) => {
    const serverCompiler = webpack(require(paths.webpackServerConfig));

    let outputFs;
    if (compileInMemory) {
      outputFs = new Memoryfs();
      serverCompiler.outputFileSystem = outputFs;
    }

    serverCompiler.run((err, stats) => {
      console.log(stats.toString({ colors: true}));
      const thisFs = compileInMemory ? outputFs : fs;

      if (thisFs.existsSync(paths.serverBundleOutputEntry)) {
        const fileContent = thisFs.readFileSync(paths.serverBundleOutputEntry, 'utf-8');
        const templateFile = requireFromString(fileContent);
        resolve(templateFile);
      } else {
        reject('error');
      }
    })
  });

  return bundlePromise;
}

export async function getPageData(pageId: string): Promise<Record<string, any>> {
  return (await getBundle()).pages[pageId].data();
}

export async function getAppTemplate(pageData): Promise<string> {
  return (await getBundle()).appTemplate(pageData)
}

async function start() {
  const pageTemplate = fs.readFileSync(paths.distIndex, 'utf-8');
  const pages = await getAvailablePages();

  await Promise.all(pages.map(async (page) => {
    const data = await getPageData(page.id);
    const templateResult = await getAppTemplate(data);

    const pageOutput = pageTemplate.replace('{{content}}', templateResult);

    const outputPath = path.resolve(paths.distSitePath, `${page.id}.html`);
    fs.ensureFileSync(outputPath);
    fs.writeFileSync(outputPath, pageOutput);
    console.log('[generated]', `${page.id}.html`);
  }))
};

start();