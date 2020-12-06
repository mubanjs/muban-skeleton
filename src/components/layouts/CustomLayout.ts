import { defineComponent, html } from '@muban/muban';
import { supportLazy } from '@muban/muban/lib/utils/lazy';

export const LayoutCustom = defineComponent({
  name: 'layout-custom',
  setup() {
    return [];
  }
})

export const lazy = supportLazy(LayoutCustom);