import { html } from '@muban/muban/dist/esm/lib/template/mhtml';

export type ButtonTemplateProps = {
  label: string;
};

export const buttonTemplate = ({ label }: ButtonTemplateProps, ref?: string): string => {
  return html`<button data-component="button" data-ref=${ref} class="btn btn-primary">
    ${label}
  </button>`;
};

export const meta = {
  template: buttonTemplate,
};
