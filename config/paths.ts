import path from 'path';
const argv = require('yargs').argv;

const projectDir = path.resolve(__dirname, '../');
const srcPath = path.resolve(projectDir, './src');
const distPath = path.resolve(projectDir, './dist');

const resolveProject = (relativePath) => path.resolve(projectDir, relativePath);
const resolveSource = (relativePath) => path.resolve(srcPath, relativePath);
const resolveDist = (relativePath) => path.resolve(distPath, relativePath);

const publicPath = getPublicPath('/');
console.log('publicPath', publicPath);

export const paths = {
  dotenv: resolveProject('.env'),
  packageJson: resolveProject('./package.json'),
  nodeModules: resolveProject('./node_modules'),
  projectDir,
  srcPath,
  distPath,
  publicPath,
  serverBundleEntry: path.resolve(srcPath, './server-bundle.ts'),
  distSitePath: resolveDist('./site'),
  distSiteStaticPath: resolveDist('./site/static'),
  distMockNodePath: resolveDist('./node'),
  mockPath: resolveProject('./mocks'),
  webpackClientConfig: resolveProject('./config/webpack.config.ts'),
  webpackServerConfig: resolveProject('./scripts/devserver/webpack.config.ts'),
  serverBundleOutputDir: resolveProject('./scripts/devserver/output'),
  serverBundleOutputEntry: resolveProject('./scripts/devserver/output/main.js'),
  webpackMockConfig: resolveProject('./scripts/webpack.config.mock.js'),
  devIndex: resolveProject('./scripts/devserver/index.html'),
  distIndex: resolveProject('./scripts/devserver/index.html'),
  webpackAssetPath: resolveSource('./assets'), // required through webpack
  webpackAssetFonts: resolveSource('./assets/fonts'),
  webpackAssetImages: resolveSource('./assets/images'),
  publicAssetPath: resolveSource('./public'), // CopyWebpackPlugin
  pagesPath: resolveSource('./pages'), // Only Dev and Preview
  pagesAssetPath: resolveSource('./pages/static'), // Only Dev and Preview
  tsConfig: resolveProject('./tsconfig.json'),
};

function getPublicPath(defaultPublicPath) {
  let publicPath = defaultPublicPath;

  if (argv.publicPath) {
    // TODO: currently not supported when using webpack-cli
    //  since that will validate any parameter
    //  Use process.env.PUBLIC_PATH instead
    publicPath = argv.PUBLIC_PATH;
    console.log('Using publicPath from "--publicPath"');
  } else if (process.env.PUBLIC_PATH) {
    publicPath = process.env.PUBLIC_PATH;
    console.log('Using publicPath from "process.env.PUBLIC_PATH"');
  }

  // force leading / if not relative with '.'
  if (!publicPath.startsWith('/') && !publicPath.startsWith('.')) {
    publicPath = `/${publicPath}`;
  }
  // force trailing /
  if (!publicPath.endsWith('/')) {
    publicPath = `${publicPath}/`;
  }

  return publicPath;
}
