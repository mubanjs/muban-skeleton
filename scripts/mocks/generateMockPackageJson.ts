import fs from 'fs';
import path from 'path';
import recursive from 'recursive-readdir';
import { execSync } from 'child_process';
import shell from 'shelljs';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
import { getClientEnvironment } from '../../config/env';
import nodeExternals from 'webpack-node-externals';

import { paths } from '../../config/paths';

// This bundles all node_modules inside the output files,
// so that no "yarn install" is required on the server,
// but files will become much larger (over 2 MB each)
// TODO: can't work due to dynamic requires that can't be bundled by webpack
const BUNDLE_PACKAGES = false;

// We will provide `paths.publicUrlOrPath` to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
// Get environment variables to inject into our app.
const env = getClientEnvironment(paths.publicPath.slice(0, -1));

async function start() {
  // clean up
  shell.rm('-rf', paths.distMockNodePath);
  // prepare folders
  shell.mkdir('-p', paths.distMockNodePath);

  // copy over mocks
  // shell.cp('-r', paths.mockPath, path.resolve(paths.distMockNodePath, './mocks'));

  // copy over index file that starts the server
  shell.cp(
    path.resolve(paths.projectDir, './scripts/mocks/index.ts'),
    path.resolve(paths.distMockNodePath, './index.ts'),
  );

  // compile index.ts in place
  execSync(`tsc -p ${path.resolve(paths.projectDir, './scripts/mocks/tsconfig.mocks.json')}`);

  const mockConfig = await buildMockWebpackConfig(path.resolve(paths.distMockNodePath, './mocks'));
  webpack(mockConfig, (err, stats) => {
    if (err || !stats) {
      console.error(err);
      return;
    }

    if (stats.hasErrors()) {
      console.log(
        stats.toString({
          colors: true,
          // all: false,
          warnings: true,
          errors: true,
          errorDetails: true,
        }),
      );
      return;
    } else {
      console.log(
        stats.toString({
          colors: true,
        }),
      );
      console.log('\nMock files created\n');
    }

    // remove static folder, this is being deployed by the actual project
    shell.rm('-rf', `${paths.distMockNodePath}/mocks/static`);

    // move compiled index to the root again
    // shell.mv(`${paths.distMockNodePath}/mocks/index.js`, `${paths.distMockNodePath}/index.js`);

    // remove source TS files
    shell.rm('-rf', `${paths.distMockNodePath}/*.ts`);
    // shell.rm('-rf', `${paths.distMockNodePath}/**/*.ts`);

    // generate package.json
    const packageJson = require(path.resolve(paths.projectDir, './package.json'));
    const content = {
      name: 'monck-server',
      version: '1.0.0',
      main: 'index.js',
      license: 'MIT',
      scripts: {
        start: 'node index.js',
      },
      dependencies: BUNDLE_PACKAGES ? [] : packageJson.dependencies,
      devDependencies: BUNDLE_PACKAGES ? [] : packageJson.devDependencies,
    };
    fs.writeFileSync(
      path.resolve(paths.distMockNodePath, './package.json'),
      JSON.stringify(content, null, 2),
      'utf-8',
    );

    console.log('done');
  });
}

start();

/**
 * Collect all mock files to use as webpack entry points
 */
function getMockFiles(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    recursive(
      paths.mockPath,
      [
        // return true to ignore something
        (fileOrFolderPath, stats) => {
          return (
            // ignore any folder
            stats.isDirectory() ||
            // ignore any non-ts files (but allow folders to do recursion)
            (!stats.isDirectory() && !['.ts', '.js'].includes(path.extname(fileOrFolderPath))) ||
            // ignore any file or folder that starts with an underscore
            path.basename(fileOrFolderPath).startsWith('_')
          );
        },
      ],
      (err, files) => {
        if (err) {
          return reject(err);
        }
        const pages = files.map((f) => path.basename(f));

        // console.log('pages', pages);
        resolve(pages);
      },
    );
  });
}

/**
 * Builds mock files with webpack to allow asset requires.
 * Used for build, and during devserver in watch mode
 *
 * @param outputPath
 */
export async function buildMockWebpackConfig(outputPath: string): Promise<webpack.Configuration> {
  const files = await getMockFiles();
  return {
    mode: 'production',
    target: 'node',
    // Stop compilation early in production
    bail: true,
    devtool: false,
    // generate an individual "library" file for each file in the mock directory
    entry: files.reduce(
      (acc, file) => ({
        ...acc,
        [path.basename(file, path.extname(file))]: path.resolve(paths.mockPath, `./${file}`),
      }),
      {},
    ),
    output: {
      // The build folder.
      path: outputPath, // change the sub folders in the respective loaders
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      // For consistent inclusions in server-generated pages, we don't add a [contenthash]
      // in production either.
      filename: '[name].js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: `[name].chunk.js`,
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // TODO: add info about how to change this
      publicPath: paths.publicPath,
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
      libraryTarget: 'commonjs2',
    },
    externals: BUNDLE_PACKAGES ? [] : [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [paths.srcPath, paths.mockPath, 'node_modules'],
    },
    module: {
      rules: [
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            {
              test: /\.js$/,
              enforce: 'pre',
              use: [require.resolve('source-map-loader')],
            },
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs|ts)$/,
              include: [paths.mockPath, paths.srcPath],
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                    // See #6846 for context on why cacheCompression is disabled
                    cacheCompression: false,
                    compact: false,
                  },
                },
                {
                  loader: require.resolve('ts-loader'),
                },
              ],
            },
            {
              test: /\.(png|jpe?g|gif)(\?.*)?$/,
              type: 'asset/resource',
              generator: {
                filename: `static/images/[name].[contenthash:8][ext][query]`,
              },
            },
            {
              test: /\.(mp4|webm)(\?.*)?$/,
              type: 'asset/resource',
              generator: {
                filename: `static/video/[name].[contenthash:8][ext][query]`,
              },
            },
            {
              test: /\.(wav|mp3|m4a|aac|oga)(\?.*)?$/,
              type: 'asset/resource',
              generator: {
                filename: `static/audio/[name].[contenthash:8][ext][query]`,
              },
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              type: 'asset/resource',
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|mjs|ts)$/, /\.html$/, /\.json$/],
              generator: {
                filename: `static/other/[name].[contenthash:8][ext][query]`,
              },
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ],
    },

    plugins: [
      new webpack.ProgressPlugin(),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(paths.projectDir),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      new webpack.DefinePlugin(env.stringified),

      new CopyWebpackPlugin({
        patterns: [
          {
            from: paths.mockPath,
            to: outputPath,
            filter: (resourcePath) =>
              !resourcePath.endsWith('.js') && !resourcePath.endsWith('.ts'),
          },
        ],
      }),
    ].filter(Boolean),

    optimization: {
      minimize: false,
      mangleExports: false,
      usedExports: true,
    },
  };
}
