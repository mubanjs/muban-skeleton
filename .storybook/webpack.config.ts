const paths = require('../config/paths');

/**
 * NOTE: Storybook still uses webpack 4, so might not be 1-on-1 compatible with
 * the project webpack config, which uses webpack 5!!
 */
module.exports = ({ config }) => {
  // remove this rule that deals with svgs
  config.module.rules = config.module.rules.filter((rule) => !String(rule.test).includes('svg'));
  // add the rule back without the svg in it, jep, a bit hacky
  config.module.rules.push({
    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
    loader: require.resolve('file-loader'),
    options: {
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
        use: [{ loader: 'svg-inline-loader' }, { loader: 'svgo-loader' }],
      },
      {
        use: [{ loader: 'url-loader' }, { loader: 'svgo-loader' }],
      },
    ],
  });

  // Return the altered config
  return config;
};
