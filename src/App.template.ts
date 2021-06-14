import type { TemplateMap } from '@muban/template';
import { html } from '@muban/template';
import { layoutCustomTemplate } from './components/layouts/custom/CustomLayout.template';
import { layoutDefaultTemplate } from './components/layouts/default/DefaultLayout.template';
import { renderLazyComponentTemplate } from './utils/createComponentRenderer';

const componentMap = {
  'layout-default': layoutDefaultTemplate,
  'layout-custom': layoutCustomTemplate,
};

export type AppTemplateProps = {
  layout: TemplateMap<typeof componentMap>;
};

export function appTemplate({ layout }: AppTemplateProps): string {
  return html`<div data-component="app">
    ${renderLazyComponentTemplate(componentMap, { component: layout })}
  </div>`;
}
