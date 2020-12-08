const paths = require('../../config/paths').paths;

const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: paths.serverBundleEntry,
  output: {
    publicPath: '',
    globalObject: 'this',
    path: paths.serverBundleOutputDir,
    filename: '[name].js',
    // library: 'templates',
    libraryTarget: 'commonjs2',
  },

  plugins: [
    new webpack.ProgressPlugin(),
  ],

  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      include: [paths.srcPath],
      exclude: [/node_modules/]
    }, {
      test: /.(scss|css)$/,
      use: 'null-loader'
    }]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  optimization: {
    minimize: false,
    // runtimeChunk: 'single',
    usedExports: true,
    mangleExports: false,
  },

  devtool: false,
}