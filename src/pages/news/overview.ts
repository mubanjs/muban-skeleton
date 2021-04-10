import type { AppTemplateProps } from '../../App.template';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'layout-custom',
    props: {
      message: 'News Overview',
    },
  },
});

// https://github.com/nfl/react-helmet
export const meta = () => ({
  title: 'foo',
  description: 'bar',
});
