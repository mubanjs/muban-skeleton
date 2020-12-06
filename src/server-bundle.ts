const pages = {};
const context = require.context('./pages/', true, /\.ts$/);
context.keys().forEach(key => {
  pages[/\/(.*)\.ts/gi.exec(key)[1]] = context(key);
});

const appTemplate = require('./App').appTemplate;

module.exports = {
  appTemplate,
  pages,
};
