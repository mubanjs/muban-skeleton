import type { AppTemplateProps } from '../App.template';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'layout-custom',
    props: {
      message: "I'm fine",
    },
  },
});
