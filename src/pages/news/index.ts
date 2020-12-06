import { AppTemplateProps } from '../../App';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'layout-default',
    props: {
      blocks: [
        {
          name: 'toggle-expand',
          props: {
            isExpanded: false
          }
        }
      ]
    }
  }
});

// https://github.com/nfl/react-helmet
export const meta = () => ({
  title: 'foo',
  description: 'bar',
});