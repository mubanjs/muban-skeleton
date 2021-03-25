import { defineComponent, computed, bind } from '@muban/muban';
import componentImage from './images/component-test.jpg';

import './ImageTest.styles.scss';

export const ImageTest = defineComponent({
  name: 'image-test',
  refs: {
    jsImage: 'js-image',
  },
  setup({ refs }) {
    return [
      bind(refs.jsImage, { attr: { src: computed(() => componentImage)  }}),
    ];
  },
});
