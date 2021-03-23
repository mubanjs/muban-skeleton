import { html } from '@muban/muban/dist/esm/lib/template/mhtml';
import type { ComponentTemplate } from '@muban/muban';

export type ComponentRendererTemplateProps = {
  component?: { name: string; props: Record<string, unknown> };
  components?: Array<{ name: string; props: Record<string, unknown> }>;
};

export function renderLazyComponentTemplate(
  componentMap: Record<string, ComponentTemplate>,
  { component, components }: ComponentRendererTemplateProps,
): string | Array<string> {
  const renderList = (components || []).concat(component || []);
  return html`${renderList.map((c) => componentMap[c.name]?.(c.props) || '')}`;
}
