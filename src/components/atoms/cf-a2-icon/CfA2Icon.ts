import { bind, defineComponent, propType } from '@muban/muban';
import { ref } from '@vue/reactivity';
import { isString } from 'isntnt';
import './CfA2Icon.styles.scss';

export const CfA2Icon = defineComponent({
  name: 'cf-a2-icon',
  props: {
    name: propType.string.validate(isString),
  },
  setup({ props, refs }) {
    const source = ref('');

    import(`./svg/${props.name}.svg?raw`).then((m) => {
      source.value = m.default;
    });

    return [
      bind(refs.self, {
        html: source,
      }),
    ];
  },
});
