import type { AppTemplateProps } from '../App';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'layout-custom',
    props: {
      message: `I'm fine`
    }
  }
});