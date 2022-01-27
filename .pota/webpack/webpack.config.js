import { join, resolve, extname, basename } from 'path';

import * as paths from '@pota/webpack-skeleton/.pota/paths.js';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

import historyApiFallback from 'connect-history-api-fallback';
import { createMockMiddleware } from '@mediamonks/monck';

import MubanPagePlugin from './plugins/MubanPagePlugin.js';
import EmitMockMainPlugin from './plugins/EmitMockMainPlugin.js';
import CopyEmittedAssetsPlugin from './plugins/CopyEmittedAssetsPlugin.js';

import { isString, createFindPlugin, getNodeTargetRules, Recursive } from './utils.js';

const CSS_TEST = /\.css$/;
const SCSS_TEST = /\.(scss|sass)$/;

const MOCKS_DIR = resolve(paths.user, 'mocks');
const MOCKS_OUTPUT_DIR = resolve(paths.user, 'dist', 'node');

function createMainConfig(config, { mainName, pagesName, mockApi }) {
  let { plugins } = config;

  const isDev = config.mode
    ? config.mode === 'development'
    : process.env.NODE_ENV === 'development';

  const findPlugin = createFindPlugin(config);
  const htmlPlugin = findPlugin('HtmlWebpackPlugin');
  const miniCssExtractPlugin = findPlugin('MiniCssExtractPlugin');

  plugins = plugins.filter((plugin) => plugin !== htmlPlugin && plugin !== miniCssExtractPlugin);

  const mocksDir = join(MOCKS_OUTPUT_DIR, './mocks');
  const mocksHotUpdateDir = join(mocksDir, './static', './webpack');

  /** @type {import('webpack').Configuration} */
  return {
    ...config,
    name: mainName,
    output: {
      ...config.output,
      filename: `static/chunks/[name].js`,
    },
    optimization: {
      ...config.optimization,
      runtimeChunk: undefined,
      splitChunks: {
        ...config.splitChunks,
        cacheGroups: {
          ...config.cacheGroups,
          // but Muban is special and requires a single `main.css` file 😁
          styles: {
            name: 'main',
            type: 'css/mini-extract',
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },
    module: {
      ...config.module,
      // this overriding of `style-loader` to `MiniCssExtractPlugin.loader` would happen only during production
      // but Muban is special and requires a single `main.css` file 😁
      rules: config.module.rules.map((rule) => {
        if ([String(CSS_TEST), String(SCSS_TEST)].includes(String(rule.test))) {
          return {
            ...rule,
            use: rule.use.map((use) => {
              if (use === 'style-loader') return MiniCssExtractPlugin.loader;
              if (!isString(use) && 'loader' in use && use.loader === 'sass-loader') {
                return {
                  ...use,
                  options: {
                    ...use.options,
                    // TODO: this is terribly inefficient, since we're creating a single .css file there should be a better way to add global styles
                    additionalData: `
              @import "~seng-scss";
              @import "@/styles/_global.scss";
              `,
                  },
                };
              }
              return use;
            }),
          };
        }

        return rule;
      }),
    },
    devServer: {
      ...config.devServer,
      static: {
        ...config.devServer.static,
        serveIndex: false,
      },
      devMiddleware: {
        writeToDisk(file) {
          return file.startsWith(mocksDir) && !file.startsWith(mocksHotUpdateDir);
        },
      },
      historyApiFallback: false,
      setupMiddlewares(middlewares, devServer) {
        if (!devServer) throw new Error('[onBeforeSetupMiddleware]: `devServer` is not defined');

        middlewares.unshift({
          name: 'pages',
          path: '/',
          middleware(req, res, next) {
            if (!devServer.stats) return next();

            // find all of the `.html` assets generated by the "pages" compilation (the other config)
            const pageAssets = Array.from(
              devServer.stats.stats.find(({ compilation }) => compilation.name === pagesName)
                .compilation.emittedAssets
            ).filter((asset) => asset.endsWith('.html'));

            // setup redirects from paths to html files e.g. `/my/favourite/page` to `/my/favourite/page.html`
            return historyApiFallback({
              rewrites: pageAssets.map((asset) => ({
                from: new RegExp(`^\/${asset.replace('.html', '').replace('/index', '')}$`),
                to: `/${asset}`,
              })),
            })(req, res, next);
          },
        });

        // mock middleware takes precendance over the pages one
        // as otherwise the pages middleware would overwrite the /api path
        if (mockApi) {
          middlewares.unshift({
            name: 'monck',
            path: '/api',
            middleware: createMockMiddleware(mocksDir),
          });
        }

        return middlewares;
      },
    },
    plugins: [
      ...plugins,
      // this plugin is generally applied only during production builds, but Muban is special and requires a single `main.css` file 😁
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: 'static/css/[name].css',
        chunkFilename: `static/css/${isDev ? '[id]' : '[id].[contenthash]'}.css`,
      }),
    ],
  };
}
function createPagesConfig(config, { pagesName, isDev }, options) {
  const definePlugin = createFindPlugin(config)('DefinePlugin');

  const source = join(paths.source, './pages');
  const publicDir = join(source, './public');

  /** @type {import('webpack').Configuration} */
  return {
    ...config,
    name: pagesName, // required so the `devServer` can find the correct compilation
    target: 'node',
    mode: 'development', // we do not care about the size of the output, it just needs to be built fast
    devtool: false, // source maps will not be used
    entry: { pages: resolve(source, '_main.ts') },

    cache: options.cache && {
      type: 'filesystem',
      name: `${pagesName}-${isDev ? 'development' : 'production'}`,
    },

    output: {
      ...config.output,
      // we are importing the module as a string, so we must bundle it as `commonjs`
      chunkFormat: 'commonjs',
      library: { type: 'commonjs' },
    },
    optimization: {
      minimize: false,
      moduleIds: 'named',
      runtimeChunk: undefined,
    },
    module: {
      ...config.module,
      rules: getNodeTargetRules(config),
    },
    // we only care about compiling the `.ts` files in the `/src/pages` directory into `.html` files
    plugins: [
      definePlugin,
      new MubanPagePlugin({ template: resolve(publicDir, 'index.html') }),
      new CopyPlugin({
        patterns: [
          {
            from: publicDir,
            toType: 'dir',
            globOptions: {
              ignore: ['**/.*', resolve(publicDir, 'index.html')],
            },
          },
        ],
      }),
    ],
  };
}

async function createMockConfig(config, { mocksName, isDev }, options) {
  const definePlugin = createFindPlugin(config)('DefinePlugin');

  const entry = Object.fromEntries(
    (await Recursive.readdir(MOCKS_DIR))
      .filter((file) => extname(file) === '.ts' && !basename(file).startsWith('_'))
      .map((file) => [basename(file, extname(file)), resolve(MOCKS_DIR, file)])
  );

  /** @type {import('webpack').Configuration} */
  return {
    ...config,
    name: mocksName, // required so the `devServer` can find the correct compilation
    target: 'node',
    mode: 'development', // we do not care about the size of the output, it just needs to be built fast
    devtool: false, // source maps will not be used

    entry,

    cache: options.cache && {
      type: 'filesystem',
      name: `${mocksName}-${isDev ? 'development' : 'production'}`,
    },

    output: {
      ...config.output,
      path: MOCKS_OUTPUT_DIR,
      filename: './mocks/[name].mjs',
      chunkFilename: `./mocks/[name].chunk.mjs`,
      chunkFormat: 'commonjs',
      module: true,
      library: { type: 'module' },
    },
    experiments: { outputModule: true },
    optimization: {
      minimize: false,
      moduleIds: 'named',
      runtimeChunk: undefined,
    },
    module: {
      ...config.module,
      rules: [
        {
          oneOf: getNodeTargetRules(config)[0].oneOf.map((rule) => {
            if ('include' in rule) {
              return { ...rule, include: [rule.include, MOCKS_DIR] };
            }

            return rule;
          }),
        },
      ],
    },
    plugins: [
      definePlugin,
      new CopyPlugin({
        patterns: [
          {
            from: MOCKS_DIR,
            to: join(MOCKS_OUTPUT_DIR, './mocks'),
            globOptions: {
              ignore: ['**/.*', '**/*.js', '**/*.ts'],
            },
          },
        ],
      }),
      !isDev && new EmitMockMainPlugin(),
      !isDev && new CopyEmittedAssetsPlugin(/^static\//, config.output.path),
    ].filter(Boolean),
  };
}

function parseOptions(options) {
  let { preview = false, ['mock-api']: mockApi = false } = options;

  if (preview === 'false') preview = false;
  if (mockApi === 'false') mockApi = false;

  return { preview, mockApi };
}

export default async function createConfig(config, options = {}) {
  const isDev = (config.mode ?? process.env.NODE_ENV) === 'development';

  const { preview, mockApi } = parseOptions(options);

  const mainName = 'muban';
  const pagesName = 'pages';
  const mocksName = 'mocks';

  /** @type {import('webpack').Configuration[]} */
  return [
    // the "main" configuration for bundling the muban app
    createMainConfig(config, { mainName, pagesName, mockApi }),
    // the "pages" configuration for bundling the static pages (also used to serve development pages)
    (preview || isDev) && createPagesConfig(config, { pagesName, isDev }, options),
    mockApi && (await createMockConfig(config, { mocksName, isDev }, options)),
  ].filter(Boolean);
}
