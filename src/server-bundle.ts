// @ts-ignore
const context = require.context('./pages/', true, /\.ts$/);
const pages = context.keys().reduce(
  (pages, key) => ({
    ...pages,
    [/\/(.*)\.ts/gi.exec(key)![1] as string]: context(key),
  }),
  {},
);

// @ts-ignore
const appTemplate = require('./App.template').appTemplate;

// @ts-ignore
module.exports = {
  appTemplate,
  pages,
};
