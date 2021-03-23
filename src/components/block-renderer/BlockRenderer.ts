import { defineComponent, lazy } from '@muban/muban';
import { ImageTest } from '../atoms/image-test/ImageTest';

export const BlockRenderer = defineComponent({
  name: 'block-renderer',
  components: [
    lazy(
      'toggle-expand',
      () => import(/* webpackExports: "lazy" */ '../atoms/toggle-expand/ToggleExpand'),
    ),
    ImageTest
  ],
  setup() {
    return [];
  },
});
