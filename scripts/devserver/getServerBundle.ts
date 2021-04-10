import type webpack from 'webpack';
import { getBundleFile } from '../utils';

let templateFile: {
  pages: Record<string, any>;
  appTemplate: (pageData) => Promise<string>;
} | null = null;
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

export function getPageFromPath(pagePath: string): string | null {
  if (!templateFile) return null;
  // remove trailing / or .html
  const pageId = pagePath.replace(/(\.html|\/)$/gi, '');

  // try the following
  // - 'pageId'
  // - 'pageId/index' (or 'index')
  //
  // which can result in:
  // - /
  //   - '' (never)
  //   - 'index' (index.ts)
  // - /index.html
  //   - 'index' (index.ts)
  //   - 'index/index' (never)
  // - /news - /news.html - /news/
  //   - news (news.ts)
  //   - news/index (news/index.ts)
  // - /news/overview - /news/overview.html /news/overview/
  //   - news/overview (news/overview.ts)
  //   - news/overview/index (news/overview/index.ts)
  return (
    [pageId, pageId + (pageId === '' ? '' : '/') + 'index'].find(
      (id) => id in templateFile!.pages,
    ) || null
  );
}

export async function getPageData(pagePath: string): Promise<null | Record<string, any>> {
  await waitForCompile();

  const getPage = (pageId) => {
    if (!templateFile) return null;

    if (templateFile.pages[pageId]) {
      return templateFile.pages[pageId];
    }

    // TODO: this doesn't work yet
    return {
      default: () => 'auto index',
      data: () => ({ blocks: [] }),
    };
  };
  let pageData = getPage(getPageFromPath(pagePath.slice(1)));
  return pageData?.data() ?? null;
}

export async function getAppTemplate(pageData): Promise<string> {
  await waitForCompile();

  if (!pageData) {
    return 'Something went wrong or no Page found – check your node logs';
  }

  return templateFile!.appTemplate(pageData);
}
