import { html } from '@muban/muban';
import { blockRendererTemplate, BlockRendererTemplateProps } from '../block-renderer/BlockRenderer.template';
import { LayoutDefault } from './DefaultLayout';

export type LayoutDefaultTemplateProps = BlockRendererTemplateProps;

export function layoutDefaultTemplate({ blocks }: LayoutDefaultTemplateProps): string {
  return html`<div data-component=${LayoutDefault.displayName}>
    ${blockRendererTemplate({ blocks })}
  </div>`;
}
