import { html } from '@muban/muban/dist/esm/lib/template/mhtml';
import {
  blockRendererTemplate,
  BlockRendererTemplateProps,
} from '../block-renderer/BlockRenderer.template';

export type LayoutDefaultTemplateProps = BlockRendererTemplateProps;

export function layoutDefaultTemplate({ blocks }: LayoutDefaultTemplateProps): string {
  return html`<div data-component="layout-default">
    ${blockRendererTemplate({ blocks })}
  </div>`;
}
