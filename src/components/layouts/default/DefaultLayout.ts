import { defineComponent } from '@muban/muban';
import { supportLazy } from '@muban/muban/dist/esm/lib/api/apiLazy';
import { BlockRenderer } from '../../block-renderer/BlockRenderer';

export const defaultLayout = defineComponent({
  name: 'default-layout',
  components: [BlockRenderer],
  setup() {
    return [];
  },
});

export const lazy = supportLazy(defaultLayout);
