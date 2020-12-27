/* eslint-disable react/jsx-key */
import { defineComponent, Ref, ref, propType, computed, bind } from '@muban/muban';
import { supportLazy } from '@muban/muban/lib/utils/lazy';
import { isBoolean, optional } from 'isntnt';

import './toggle-expand.scss';

export const useToggle = (
  initialValue: boolean,
): readonly [Ref<boolean>, (force?: boolean) => void] => {
  const state = ref(initialValue);
  const toggle = (force?: boolean) => (state.value = force === undefined ? !state.value : force);
  return [state, toggle] as const;
};

const getButtonLabel = (isExpanded: boolean) => (isExpanded ? 'read less...' : 'read more...');

export const ToggleExpand = defineComponent({
  name: 'toggle-expand',
  props: {
    isExpanded: propType.boolean.validate(optional(isBoolean)),
  },
  refs: {
    expandButton: 'expand-button',
    expandContent: 'expand-content',
  },
  setup({ props, refs }) {
    const [isExpanded, toggleExpanded] = useToggle(props.isExpanded ?? false);
    const expandButtonLabel = computed(() => getButtonLabel(isExpanded.value));

    return [
      bind(refs.expandButton, { text: expandButtonLabel, click: () => toggleExpanded() }),
      bind(refs.self, {
        css: { isExpanded },
      }),
    ];
  },
});

export const lazy = supportLazy(ToggleExpand);
