import { html } from '@muban/muban';
import { LayoutCustom } from './CustomLayout';


export type LayoutCustomTemplateProps = { message: string };

export function layoutCustomTemplate({ message }: LayoutCustomTemplateProps): string {
  return html`<div data-component=${LayoutCustom.displayName}>
    Nothing to show here - ${message}.
  </div>`;
}