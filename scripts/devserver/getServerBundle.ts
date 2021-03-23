import chalk from 'chalk';
import { resolve } from 'path';
import type webpack from 'webpack';
import { getBundleFile } from '../utils';

let templateFile: any = null;
let watcher: webpack.Watching;

export function startWatcher(compiler: webpack.Compiler): webpack.Watching {
  watcher = compiler.watch({}, (err, stats) => {
    if (err) {
      console.error('[templates] Error while watching', err);
      process.exit(1);
    }
    const isSuccessful = stats && !stats.hasErrors();

    if (isSuccessful) {
      templateFile = getBundleFile();
    } else {
      templateFile = null;
    }
  });
  return watcher;
}

function canUseTemplateFile(): boolean {
  return watcher && !watcher.running && Boolean(templateFile);
}

export function waitForCompile(): Promise<void> {
  if (canUseTemplateFile()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (canUseTemplateFile()) {
        clearInterval(interval);
        resolve();
      }
    }, 10);
  });
}

export async function getPageData(pagePath: string): Promise<null | Record<string, any>> {
  await waitForCompile();

  const getPage = (pageId) => {
    if (!templateFile) return null;

    if (templateFile.pages[pageId]) {
      return templateFile.pages[pageId];
    }
    if (templateFile.pages['index']) {
      return templateFile.pages['index'];
    }

    return {
      default: () => 'auto index',
      data: () => ({ blocks: [] }),
    };
  };
  let pageData = getPage(pagePath.slice(1));
  return pageData?.data() ?? null;
}

export async function getAppTemplate(pageData): Promise<string> {
  await waitForCompile();

  if (!pageData) {
    return 'Something went wrong – check your node logs';
  }

  return templateFile.appTemplate(pageData);
}
