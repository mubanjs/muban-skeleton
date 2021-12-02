export { appTemplate } from '../App.template';

const context = require.context('.', true, /\.ts$/);

export const pages = context.keys().reduce(
  (pages, key) => ({
    ...pages,
    [/\/(.*)\.ts/gi.exec(key)![1] as string]: context(key),
  }),
  {},
);
