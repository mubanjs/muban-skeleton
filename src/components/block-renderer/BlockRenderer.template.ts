/* eslint-disable @typescript-eslint/no-explicit-any */
import { html } from '@muban/muban';
import { renderLazyComponentTemplate } from '../../utils/createComponentRenderer';
import type { ToggleExpandProps } from '../atoms/toggle-expand/ToggleExpand.template';
import { toggleExpandTemplate } from '../atoms/toggle-expand/ToggleExpand.template';
import { ToggleExpand } from '../atoms/toggle-expand/ToggleExpand';

export type BlockRendererTemplateProps = {
  blocks: Array<
    | { name: typeof ToggleExpand.displayName, props: ToggleExpandProps }
    >;
};

export function blockRendererTemplate({ blocks }: BlockRendererTemplateProps): string {
  return html`<div data-component="block-renderer">
    ${renderLazyComponentTemplate({
      [ToggleExpand.displayName]: toggleExpandTemplate
    }, { components: blocks })}
  </div>`;
}
