import { getClientEnvironment } from '../config/env';
import { paths } from '../config/paths';

// webpack 4 version of the plugin
import webpack from '@storybook/core/node_modules/webpack';

// We will provide `paths.publicUrlOrPath` to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
// Get environment variables to inject into our app.
const env = getClientEnvironment(paths.publicPath.slice(0, -1));

/**
 * NOTE: Storybook still uses webpack 4, so might not be 1-on-1 compatible with
 * the project webpack config, which uses webpack 5!!
 */
export default ({ config }) => {
  // Add the src path so we can load the assets
  config.resolve.modules = [paths.srcPath, ...config.resolve.modules];

  config.plugins.push(new webpack.DefinePlugin(env.stringified));

  // remove this rule that deals with SVGs and media files
  config.module.rules = config.module.rules.filter(
    (rule) => !(String(rule.test).includes('svg') || String(rule.test).includes('mp4')),
  );
  // Add the rule back without the svg in it, jep, a bit hacky
  config.module.rules.push({
    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
      esModule: false,
    },
  });

  // Re-add the media rule but with esModule turned off, to be in sync with the other assets
  config.module.rules.push({
    test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
      esModule: false,
    },
  });

  // Add a loader for the svg's
  config.module.rules.push({
    test: /\.svg$/,
    oneOf: [
      {
        resourceQuery: /inline/,
        use: [{ loader: 'raw-loader', options: { esModule: false } }, { loader: 'svgo-loader' }],
      },
      {
        use: [{ loader: 'url-loader' }, { loader: 'svgo-loader' }],
      },
    ],
  });

  // Return the altered config
  return config;
};
