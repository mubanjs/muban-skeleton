import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { meta, HeadingTemplateProps } from './Heading.template';

export default {
  title: 'Button',
  argTypes: {
    label: { control: 'text' },
  },
};

export const Default: Story<HeadingTemplateProps> = () => meta;
Default.args = {
  as: 'h1',
  style: 'h2',
  copy: 'Hello World',
};
