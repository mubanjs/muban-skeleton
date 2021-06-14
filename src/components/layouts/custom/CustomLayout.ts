import { defineComponent } from '@muban/muban';
import { supportLazy } from '@muban/muban/dist/esm/lib/api/apiLazy';

export const LayoutCustom = defineComponent({
  name: 'layout-custom',
  setup() {
    return [];
  },
});

export const lazy = supportLazy(LayoutCustom);
