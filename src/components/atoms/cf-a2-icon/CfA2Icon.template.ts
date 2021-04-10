import { html } from '@muban/template';
import classNames from 'classnames';

import type { CfA2IconTemplateProps } from './CfA2Icon.types';

export const cfA2Icon = ({ name, className }: CfA2IconTemplateProps, ref?: string) => html`<span
  data-component="cf-a2-icon"
  data-name=${name}
  data-ref=${ref}
  ...${{ class: className ? classNames(className) : null }}
/>`;
