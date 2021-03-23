/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TemplateMap } from '@muban/muban';
import { html } from '@muban/muban/dist/esm/lib/template/mhtml';
import { renderLazyComponentTemplate } from '../../utils/createComponentRenderer';
import { imageTestTemplate } from '../atoms/image-test/ImageTest.template';
import { toggleExpandTemplate } from '../atoms/toggle-expand/ToggleExpand.template';

const componentMap = {
  'toggle-expand': toggleExpandTemplate,
  'image-test': imageTestTemplate,
};

export type BlockRendererTemplateProps = {
  blocks: Array<TemplateMap<typeof componentMap>>;
};

export function blockRendererTemplate({ blocks }: BlockRendererTemplateProps): string {
  return html`<div data-component="block-renderer">
    ${renderLazyComponentTemplate(componentMap, { components: blocks })}
  </div>`;
}
