const pages = {};

// @ts-ignore
const context = require.context('./pages/', true, /\.ts$/);
context.keys().forEach((key) => {
  pages[/\/(.*)\.ts/gi.exec(key)![1]] = context(key);
});

// @ts-ignore
const appTemplate = require('./App.template').appTemplate;

// @ts-ignore
module.exports = {
  appTemplate,
  pages,
};
