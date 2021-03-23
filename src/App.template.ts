import type { TemplateMap } from '@muban/muban';
import { html } from '@muban/muban/dist/esm/lib/template/mhtml';
import { layoutCustomTemplate } from './components/layouts/CustomLayout.template';
import { layoutDefaultTemplate } from './components/layouts/DefaultLayout.template';
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
