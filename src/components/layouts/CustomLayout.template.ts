import { html } from '@muban/template';

export type LayoutCustomTemplateProps = { message: string };

export function layoutCustomTemplate({ message }: LayoutCustomTemplateProps): string {
  return html`<div data-component="layout-custom">Nothing to show here - ${message}.</div>`;
}
