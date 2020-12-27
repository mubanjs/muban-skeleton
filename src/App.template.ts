import { html } from '@muban/muban';
import { App } from './App';
import { layoutCustomTemplate } from './components/layouts/CustomLayout.template';
import type { LayoutCustomTemplateProps } from './components/layouts/CustomLayout.template';
import { LayoutCustom } from './components/layouts/CustomLayout';
import { layoutDefaultTemplate } from './components/layouts/DefaultLayout.template';
import type { LayoutDefaultTemplateProps } from './components/layouts/DefaultLayout.template';
import { LayoutDefault } from './components/layouts/DefaultLayout';
import { renderLazyComponentTemplate } from './utils/createComponentRenderer';

export type AppTemplateProps = {
  layout:
    | { name: typeof LayoutDefault.displayName; props: LayoutDefaultTemplateProps }
    | { name: typeof LayoutCustom.displayName; props: LayoutCustomTemplateProps };
};

export function appTemplate({ layout }: AppTemplateProps): string {
  return html`<div data-component=${App.displayName}>
    ${renderLazyComponentTemplate(
      {
        [LayoutDefault.displayName]: layoutDefaultTemplate,
        [LayoutCustom.displayName]: layoutCustomTemplate,
      },
      { component: layout },
    )}
  </div>`;
}
