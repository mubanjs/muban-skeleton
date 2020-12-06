import path from 'path';

const projectDir = path.resolve(__dirname, '../');
const srcPath = path.resolve(projectDir, './src');
const distPath = path.resolve(projectDir, './dist');
const distSitePath = path.resolve(distPath, './site');

export const paths = {
  projectDir,
  srcPath,
  serverBundleEntry: path.resolve(srcPath, './server-bundle.ts'),
  distPath,
  distSitePath,
  webpackServerConfig: path.resolve(projectDir, './scripts/devserver/webpack.config.js'),
  serverBundleOutputDir: path.resolve(projectDir, './scripts/devserver/output'),
  serverBundleOutputEntry: path.resolve(projectDir, './scripts/devserver/output/main.js'),
  devIndex: path.resolve(projectDir, './scripts/devserver/index.html'),
  distIndex: path.resolve(projectDir, './scripts/devserver/index.html'),
};
