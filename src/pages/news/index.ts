import type { AppTemplateProps } from '../../App.template';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'layout-custom',
    props: {
      message: 'News Index',
    },
  },
});

// https://github.com/nfl/react-helmet
export const meta = (): Record<string, string> => ({
  title: 'foo',
  description: 'bar',
});
