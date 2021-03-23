import { getClientEnvironment } from '../../config/env';
import { paths } from '../../config/paths';

// const path = require('path');
const webpack = require('webpack');
// const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

// We will provide `paths.publicUrlOrPath` to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
// Get environment variables to inject into our app.
const env = getClientEnvironment(paths.publicPath.slice(0, -1));

module.exports = {
  mode: 'development',
  entry: paths.serverBundleEntry,
  output: {
    publicPath: paths.publicPath,
    globalObject: 'this',
    path: paths.serverBundleOutputDir,
    filename: '[name].js',
    // library: 'templates',
    libraryTarget: 'commonjs2',
  },

  plugins: [
    // TODO: Enabling this makes the whole node process unresponsive for about 10-20 seconds after compilation is done
    // new WatchMissingNodeModulesPlugin(path.resolve(paths.projectDir, './node_modules')),
    // new webpack.ProgressPlugin(),

    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV is set to production
    // during a production build.
    new webpack.DefinePlugin(env.stringified),
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        include: [paths.srcPath],
        exclude: [/node_modules/],
      },
      {
        test: /.(scss|css)$/,
        use: 'null-loader',
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
          filename: `static/images/[name].[contenthash:8][ext][query]`,
        },
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  optimization: {
    minimize: false,
    // runtimeChunk: 'single',
    usedExports: true,
    mangleExports: false,
  },
  // devServer: {
  //   stats: 'none'
  // },
  // stats: 'none',
  devtool: false,
};
