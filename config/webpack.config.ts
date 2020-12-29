const paths = require('./paths').paths;
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require('terser-webpack-plugin');

const mode = (process.env.NODE_ENV || 'production') as 'production' | 'development';
console.log('mode', mode, process.env.NODE_ENV);

module.exports = {
  mode,
  entry: path.resolve(paths.srcPath, './index.ts'),
  output: {
    path: paths.distSitePath,
  },

  plugins: [
    new webpack.ProgressPlugin(),
    mode === 'production' ? new MiniCssExtractPlugin({ filename: 'main.[chunkhash].css' }) : null,
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsFilename: path.resolve(paths.distPath, './bundlesize-profile.json'),
    }),
  ].filter(Boolean),

  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        include: [paths.srcPath],
        exclude: [/node_modules/],
      },
      {
        test: /.(scss|css)$/,

        use: [
          mode === 'production'
            ? { loader: MiniCssExtractPlugin.loader }
            : { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: '@import "/src/styles/_global.scss";',
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  optimization: {
    minimizer: [new TerserPlugin()],
    mangleExports: false,
    usedExports: true,

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false,
    },
  },
  devtool: mode === 'production' ? false : 'eval-cheap-module-source-map', // cheap-source-map
};
