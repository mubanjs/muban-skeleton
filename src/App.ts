import { defineComponent, lazy } from '@muban/muban';

export const App = defineComponent({
  name: 'app',
  components: [
    lazy(
      'layout-default',
      () => import(/* webpackExports: "lazy" */ './components/layouts/DefaultLayout'),
    ),
    lazy(
      'layout-custom',
      () => import(/* webpackExports: "lazy" */ './components/layouts/CustomLayout'),
    ),
  ],
  setup() {
    return [];
  },
});

console.log("hi")
