import { defineComponent, lazy } from '@muban/muban';

export const BlockRenderer = defineComponent({
  name: 'block-renderer',
  components: [
    lazy('toggle-expand', () => import(/* webpackExports: "lazy" */ '../atoms/toggle-expand/ToggleExpand'))
  ],
  setup() {
    return [];
  },
});
