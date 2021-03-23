import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import Memoryfs from 'memory-fs';
import requireFromString from 'require-from-string';
import clearConsole from 'react-dev-utils/clearConsole';
import { paths } from '../config/paths';
import {
  getAsset,
  getAvailablePages,
  getBundleFile,
  getCompiler,
  replaceTemplateVars,
} from './utils';

let bundlePromise:
  | undefined
  | Promise<{
      pages: Record<string, { data: () => Record<string, any> }>;
      appTemplate: (props: Record<string, any>) => string;
    } | null>;
const isInteractive = process.stdout.isTTY;

async function getBundle(): Promise<{
  pages: Record<string, { data: () => Record<string, any> }>;
  appTemplate: (props: Record<string, any>) => string;
} | null> {
  if (bundlePromise) {
    return bundlePromise;
  }

  bundlePromise = new Promise((resolve, reject) => {
    const serverCompiler = getCompiler(require(paths.webpackServerConfig));

    if (isInteractive) {
      clearConsole();
    }
    console.log(chalk.cyan`Starting template generation...\n`);

    console.log(chalk.yellow`Creating webpack bundle...`);

    serverCompiler.run((err, stats) => {
      if (stats && stats.hasErrors()) {
        console.log(stats.toString({ colors: true, errorDetails: true }));
        reject('error');
      } else if (stats) {
        console.log(chalk.green`Bundle created successfully!\n`);
        const templateFile = getBundleFile();

        if (templateFile) {
          // find relevant assets
          const assetStats = stats.toJson({ all: false, assets: true });
          const staticAssetPaths =
            (assetStats.assets &&
              assetStats.assets
                .filter((asset) => asset.name.startsWith('static/'))
                .map((asset) => asset.name)) ||
            [];

          if (staticAssetPaths.length) {
            console.log(chalk.yellow`Copying assets...`);

            // copy assets over to dist folder
            staticAssetPaths.forEach((assetPath) => {
              const content = getAsset(assetPath);
              if (content) {
                fs.writeFileSync(path.resolve(paths.distSitePath, assetPath), content);
                console.log('[copied]', assetPath);
              }
            });
          }
          console.log(chalk.green`Assets copied successfully!\n`);

          resolve(templateFile);
        } else {
          reject('error');
        }
      }
    });
  });

  return bundlePromise;
}

export async function getPageData(pageId: string): Promise<Record<string, any> | null> {
  const bundle = await getBundle();
  return (bundle && bundle.pages[pageId].data()) || null;
}

export async function getAppTemplate(pageData): Promise<string | null> {
  const bundle = await getBundle();
  return (bundle && bundle.appTemplate(pageData)) || null;
}

async function start() {
  const pageTemplate = fs.readFileSync(paths.distIndex, 'utf-8');
  const pages = await getAvailablePages();
  await getBundle();

  console.log(chalk.yellow`Generating pages...`);

  await Promise.all(
    pages.map(async (page) => {
      const data = await getPageData(page.id);
      const templateResult = await getAppTemplate(data);

      const pageOutput = replaceTemplateVars(pageTemplate, templateResult || '');

      const outputPath = path.resolve(paths.distSitePath, `${page.id}.html`);
      fs.ensureFileSync(outputPath);
      fs.writeFileSync(outputPath, pageOutput);
      console.log('[generated]', `${page.id}.html`);
    }),
  );

  console.log(chalk.green`Pages generated successfully!\n`);
}

start();
