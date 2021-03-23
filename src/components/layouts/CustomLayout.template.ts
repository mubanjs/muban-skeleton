import { html } from '@muban/muban/dist/esm/lib/template/mhtml';

export type LayoutCustomTemplateProps = { message: string };

export function layoutCustomTemplate({ message }: LayoutCustomTemplateProps): string {
  return html`<div data-component="layout-custom">
    Nothing to show here - ${message}.
  </div>`;
}
