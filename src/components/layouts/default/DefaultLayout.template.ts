import { html } from '@muban/template';
import type { BlockRendererTemplateProps } from '../../block-renderer/BlockRenderer.template';
import { blockRendererTemplate } from '../../block-renderer/BlockRenderer.template';

export type LayoutDefaultTemplateProps = BlockRendererTemplateProps;

export function layoutDefaultTemplate({ blocks }: LayoutDefaultTemplateProps): string {
  return html`<div data-component="layout-default">${blockRendererTemplate({ blocks })}</div>`;
}
