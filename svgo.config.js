const { extendDefaultPlugins } = require('svgo');

// https://github.com/svg/svgo#configuration
module.exports = {
  plugins: extendDefaultPlugins(['removeStyleElement']),
};
