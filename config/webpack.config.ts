import fs from 'fs';
import path from 'path';
import resolve from 'resolve';
import webpack from 'webpack';
import postcssNormalize from 'postcss-normalize';
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
import ForkTsCheckerWebpackPlugin from 'react-dev-utils/ForkTsCheckerWebpackPlugin';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import { getClientEnvironment } from './env';

import { paths } from './paths';

const isPreview = process.env.MUBAN_PREVIEW === 'true';
const analyze = process.env.MUBAN_ANALYZE === 'true';

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.tsConfig);

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP === 'true';

const appPackageJson = require(paths.packageJson);

// We will provide `paths.publicUrlOrPath` to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
// Get environment variables to inject into our app.
const env = getClientEnvironment(paths.publicPath.slice(0, -1));

module.exports = function () {
  // console.log('webpack env', webpackEnv, argv);
  const isEnvProduction = process.env.NODE_ENV === 'production';
  const isEnvDevelopment = process.env.NODE_ENV !== 'production';
  const mode = isEnvProduction ? 'production' : isEnvDevelopment && 'development';

  console.log('mode', mode);

  return {
    mode,
    // Stop compilation early in production
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    // TODO: create separate "preview" entry for the auto-index
    entry: path.resolve(paths.srcPath, './index.ts'),
    output: {
      // The build folder.
      path: path.resolve(paths.distSitePath, '.'), // change the sub folders in the respective loaders
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      // For consistent inclusions in server-generated pages, we don't add a [contenthash]
      // in production either.
      filename: 'static/js/[name].js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: `static/js/[name]${isEnvProduction ? '.[contenthash:8]' : ''}.chunk.js`,
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // TODO: add info about how to change this
      publicPath: paths.publicPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) => path.relative(paths.srcPath, info.absoluteResourcePath).replace(/\\/g, '/')
        : isEnvDevelopment &&
          ((info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },

    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [
        // Adds support for installing with Plug'n'Play, leading to faster installs and adding
        // guards against forgotten dependencies and such.
        // PnpWebpackPlugin,
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        // TODO: doesn't work with mini-css-extract-plugin
        // new ModuleScopePlugin(paths.srcPath, [
        //   paths.packageJson,
        // ]),
      ],
    },
    resolveLoader: {
      plugins: [
        // Also related to Plug'n'Play, but this time it tells webpack to load its loaders
        // from the current package.
        // PnpWebpackPlugin.moduleLoader(module),
      ],
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
              include: paths.srcPath,
              loader: require.resolve('babel-loader'),
              options: {
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            // {
            //   test: /\.(ts|tsx)$/,
            //   loader: require.resolve('ts-loader'),
            //   include: [paths.srcPath],
            //   exclude: [/node_modules/],
            // },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            {
              test: /.(scss|css)$/,
              use: [
                isEnvProduction || true
                  ? {
                      loader: MiniCssExtractPlugin.loader,
                      // css is located in `static/css`, use '../../' to locate index.html folder
                      // in production `paths.publicUrlOrPath` can be a relative path
                      options: paths.publicPath.startsWith('.') ? { publicPath: '../../' } : {},
                    }
                  : { loader: require.resolve('style-loader') },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 3,
                    sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                  },
                },
                {
                  // Options for PostCSS as we reference these options twice
                  // Adds vendor prefixing based on your specified browser support in
                  // package.json
                  loader: require.resolve('postcss-loader'),
                  options: {
                    postcssOptions: {
                      plugins: [
                        require('postcss-flexbugs-fixes'),
                        [
                          require('postcss-preset-env'),
                          {
                            autoprefixer: {
                              flexbox: 'no-2009',
                            },
                            stage: 3,
                          },
                        ],
                        // Adds PostCSS Normalize as the reset css with default options,
                        // so that it honors browserslist config in package.json
                        // which in turn let's users customize the target behavior as per their needs.
                        postcssNormalize(),
                      ],
                    },
                    sourceMap: isEnvProduction && shouldUseSourceMap,
                  },
                },
                {
                  loader: require.resolve('resolve-url-loader'),
                  options: {
                    sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                    root: paths.srcPath,
                  },
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    additionalData: `@import "~seng-scss"; @import "${paths.srcPath
                      .substring(paths.projectDir.length)
                      .replace(/\\/g, '/')}/styles/_global.scss";`,
                    sourceMap: true,
                  },
                },
              ],
            },
            {
              test: /\.(png|jpe?g|gif)(\?.*)?$/,
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: 1 * 1024, // 1kb
                },
              },
              generator: {
                filename: `static/images/[name]${
                  isEnvDevelopment ? '' : '.[contenthash:8]'
                }[ext][query]`,
              },
            },
            {
              test: /\.svg$/,
              oneOf: (() => {
                const svgoLoaderConfig = {
                  loader: require.resolve('svgo-loader'),
                  options: {
                    plugins: [
                      { removeStyleElement: true },
                      { removeComments: true },
                      { removeDesc: true },
                      { removeUselessDefs: true },
                      { removeTitle: true },
                      { removeMetadata: true },
                      { removeComments: true },
                      { cleanupIDs: { remove: true, prefix: '' } },
                      { convertColors: { shorthex: false } },
                    ],
                  },
                };

                return [
                  // Using `?inline` in the asset request (e.g. `foo.svg?inline`) will inline the asset
                  // in the JS source. Otherwise it will be outputted as a separate file
                  //
                  {
                    resourceQuery: /inline/,
                    type: 'asset/inline',
                    use: [svgoLoaderConfig],
                  },
                  {
                    type: 'asset/resource',
                    generator: {
                      filename: `static/svg/[name]${
                        isEnvDevelopment ? '' : '.[contenthash:8]'
                      }[ext][query]`,
                    },
                    use: [svgoLoaderConfig],
                  },
                ];
              })(),
            },
            {
              test: /\.(eot|svg|ttf|woff2?)(\?.*)?$/,
              include: path.resolve(paths.webpackAssetPath, './fonts'),
              type: 'asset/resource',
              generator: {
                filename: `static/fonts/[name]${
                  isEnvDevelopment ? '' : '.[contenthash:8]'
                }[ext][query]`,
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
                filename: `static/other/[name]${
                  isEnvDevelopment ? '' : '.[contenthash:8]'
                }[ext][query]`,
              },
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ],
    },

    plugins: [
      isEnvProduction ? new webpack.ProgressPlugin() : null,
      isEnvProduction || true
        ? new MiniCssExtractPlugin({
            ignoreOrder: true,
            filename: 'static/css/[name].css',
            chunkFilename: `static/css/${isEnvProduction ? '[id].[contenthash]' : '[id]'}.css`,
          })
        : null,
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(paths.projectDir),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      new webpack.DefinePlugin(env.stringified),

      // This is necessary to emit hot updates (CSS):
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebook/create-react-app/issues/186
      // - Disabled for now to prevent potential slowdowns
      // isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.nodeModules),

      // TypeScript type checking in a separate process since Babel will transpile everything as a loader
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          typescript: resolve.sync('typescript', {
            basedir: paths.nodeModules,
          }),
          async: isEnvDevelopment,
          checkSyntacticErrors: true,
          resolveModuleNameModule: process.versions.pnp ? `${__dirname}/pnpTs.js` : undefined,
          resolveTypeReferenceDirectiveModule: process.versions.pnp
            ? `${__dirname}/pnpTs.js`
            : undefined,
          tsconfig: paths.tsConfig,
          reportFiles: [
            // This one is specifically to match during CI tests,
            // as micromatch doesn't match
            // '../cra-template-typescript/template/src/App.tsx'
            // otherwise.
            '../**/src/**/*.{ts,tsx}',
            '**/src/**/*.{ts,tsx}',
            '!**/src/**/__tests__/**',
            '!**/src/**/?(*.)(spec|test).*',
            '!**/src/setupProxy.*',
            '!**/src/setupTests.*',
          ],
          silent: true,
          // The formatter is invoked directly in WebpackDevServerUtils during development
          formatter: isEnvProduction ? typescriptFormatter : undefined,
        }),
      // enable by passing the MUBAN_ANALYZE environment variable
      analyze
        ? new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: path.resolve(paths.distPath, './bundle-report.html'),
          })
        : null,
      new CopyWebpackPlugin({
        patterns: [
          {
            from: paths.publicAssetPath,
            to: paths.distSitePath,
            filter: (resourcePath) => !resourcePath.endsWith('readme.md'),
          },
          isPreview
            ? {
                from: paths.pagesAssetPath,
                to: path.resolve(paths.distSitePath, './static/'),
                filter: (resourcePath) => !resourcePath.endsWith('readme.md'),
              }
            : null,
        ].filter(Boolean),
      }),
    ].filter(Boolean),

    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: false,
            keep_fnames: false,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
        // This is only used in production mode
        new CssMinimizerPlugin(),
      ],
      mangleExports: false,
      usedExports: true,

      splitChunks: {
        cacheGroups: {
          vendors: {
            priority: -10,
            test: /[\\/]node_modules[\\/]/,
          },
          // Uncomment below to output all chunk in a single output file
          // styles: {
          //   name: 'styles',
          //   type: 'css/mini-extract',
          //   chunks: 'all',
          //   enforce: true,
          // },
        },

        chunks: 'async',
        minChunks: 1,
        minSize: 30000,
        name: false,
      },
    },
    stats: isEnvProduction ? 'all' : 'none',
  };
};
