import { defineComponent, lazy } from '@muban/muban';

export const App = defineComponent({
  name: 'app',
  components: [
    lazy(
      'layout-default',
      () => import(/* webpackExports: "lazy" */ './components/layouts/default/DefaultLayout'),
    ),
    lazy(
      'layout-custom',
      () => import(/* webpackExports: "lazy" */ './components/layouts/custom/CustomLayout'),
    ),
  ],
  setup() {
    return [];
  },
});
