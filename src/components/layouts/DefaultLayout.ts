import { defineComponent } from '@muban/muban';
import { supportLazy } from '@muban/muban/lib/utils/lazy';
import { BlockRenderer } from '../block-renderer/BlockRenderer';

export const LayoutDefault = defineComponent({
  name: 'layout-default',
  components: [BlockRenderer],
  setup() {
    return [];
  },
});

export const lazy = supportLazy(LayoutDefault);
