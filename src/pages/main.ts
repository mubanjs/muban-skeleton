export { appTemplate } from '../App.template';

const context = require.context('.', true, /\.ts$/);

export const pages = context.keys().reduce(
  (p, key) => ({
    ...p,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    [/\/(.*)\.ts/gi.exec(key)![1] as string]: context(key),
  }),
  {},
);
