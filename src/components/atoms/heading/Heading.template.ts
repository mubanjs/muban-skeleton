import { html, unsafeHTML } from '@muban/muban';

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingTemplateProps = {
  as: Heading;
  style: Heading;
  copy: string;
};

export const headingTemplate = ({ as, style, copy }: HeadingTemplateProps): string =>
  html`<${as} class="${style}" data-component="heading=">${unsafeHTML(copy)}</${as}>`;

export const meta = {
  template: headingTemplate,
};
