import type { Ref } from '@muban/muban';
import { onMounted, onUnmounted, ref } from '@muban/muban';

import DeviceStateTracker, { DeviceStateEvent } from 'seng-device-state-tracker';
import type IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';

import sharedVariables from '../config/shared-variables.json';

const cleanMediaQueries = Object.keys(sharedVariables.mediaQueries).reduce<{
  [key: string]: string;
}>((result, key: string) => {
  // eslint-disable-next-line no-param-reassign
  result[key] = sharedVariables.mediaQueries[key].replace(/'/g, '');
  return result;
}, {});

let deviceStateTracker: DeviceStateTracker | null = null;

export type DeviceState = IDeviceStateData['state'];
export type DeviceStateName = IDeviceStateData['name'];

/**
 * This hook can be used to access the active device state
 *
 * Example:
 * ```ts
 * const { state, name } = useDeviceStateTracker();
 * ```
 */
export const useDeviceStateTracker = (): {
  state: Ref<DeviceState>;
  name: Ref<DeviceStateName>;
} => {
  if (deviceStateTracker === null) {
    deviceStateTracker = new DeviceStateTracker({
      deviceState: sharedVariables.deviceState,
      mediaQueries: cleanMediaQueries,
      showStateIndicator: process.env.NODE_ENV === 'development',
    });
  }

  const activeDeviceState = ref<IDeviceStateData['state']>(
    deviceStateTracker.currentDeviceState.state,
  );
  const activeDeviceStateName = ref<IDeviceStateData['name']>(
    deviceStateTracker.currentDeviceState.name,
  );

  const onDeviceStateChange = (event) => {
    const { data } = event as DeviceStateEvent;
    activeDeviceState.value = data.state;
    activeDeviceStateName.value = data.name;
  };

  onMounted(() => {
    deviceStateTracker?.addEventListener(DeviceStateEvent.STATE_UPDATE, onDeviceStateChange);
  });

  onUnmounted(() => {
    deviceStateTracker?.removeEventListener(DeviceStateEvent.STATE_UPDATE, onDeviceStateChange);
  });

  return {
    state: activeDeviceState,
    name: activeDeviceStateName,
  };
};
