import type { Predicate } from 'isntnt';

export const svgContext = require.context('./svg/?inline', false, /\.svg/);

export const icons = svgContext
  .keys()
  .map<string>((path = '') => (path.split('/').pop() ?? '').split('.').shift() ?? '');

export const isIcon: Predicate<string> = (value: unknown): value is string =>
  typeof value === 'string' && icons.includes(value);
