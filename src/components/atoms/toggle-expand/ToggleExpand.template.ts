/* eslint-disable react/jsx-key */
import { html } from '@muban/muban';
import { templateComponentFactory } from '@muban/muban/dist/esm/lib/template/templateComponentFactory';
import { buttonTemplate } from '../button/Button.template';

import './toggle-expand.scss';
import { ToggleExpand } from './ToggleExpand';

const getButtonLabel = (isExpanded: boolean) => (isExpanded ? 'read less...' : 'read more...');

export type ToggleExpandProps = {
  isExpanded?: boolean;
};

export const toggleExpandTemplate = templateComponentFactory<ToggleExpandProps>({
  component: ToggleExpand,
  jsonProps(props) {
    return props;
  },
  children({ isExpanded = false }) {
    return html`
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
        voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam
        sapiente sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
      </p>
      <p>${buttonTemplate({ label: getButtonLabel(isExpanded) }, 'expand-button')}</p>
      <p data-ref="expand-content">
        Lorem ipsum <strong>dolor</strong> sit <em>amet</em>, consectetur adipisicing elit.
        Distinctio error incidunt necessitatibus repellendus sint. A, deleniti ducimus ex facere
        ipsam libero quae quas temporibus voluptas voluptates. Blanditiis consequatur deserunt
        facere!
      </p>
    `;
  },
});
