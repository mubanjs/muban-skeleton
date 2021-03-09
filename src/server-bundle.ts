const context = require.context('./pages/', true, /\.ts$/);
const pages = context.keys().reduce((pages, key) => ({
  ...pages,
  [/\/(.*)\.ts/gi.exec(key)![1] as string]: context(key),
}), {});

const appTemplate = require('./App.template').appTemplate;

module.exports = {
  appTemplate,
  pages,
};
