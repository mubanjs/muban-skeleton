import { paths } from '../config/paths';

/**
 * NOTE: Storybook still uses webpack 4, so might not be 1-on-1 compatible with
 * the project webpack config, which uses webpack 5!!
 */
export default ({ config }) => {
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

  // Add the src path so we can load the assets
  config.resolve.modules = [paths.srcPath, ...config.resolve.modules];

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
