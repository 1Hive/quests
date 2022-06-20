import env from 'src/environment';
import { getNetwork } from 'src/networks';
import { LoggerOnce } from 'src/utils/logger';

const { networkId } = getNetwork();

const flagPrefix = `FLAG.${networkId.toUpperCase()}.`;

export const flags = {
  DUMMY_QUEST: false,
  CREATE_QUEST: false,
  SWITCH_CHAIN: false,
};

function init() {
  const envFlags = env('FLAGS')?.split(',');

  envFlags?.forEach((flag: string) => {
    const [key, value] = flag.split('=');
    toggleFeatureFlag(key, value);
  });

  // Localstorage override env flags
  Object.keys(flags).forEach((key: string) => {
    const storageFlag = window.localStorage.getItem(flagPrefix + key);
    if (storageFlag) {
      toggleFeatureFlag(key, storageFlag);
    }
  });

  // When a flag is change in localstorage, it will be updated in the app
  window.onstorage = (event: StorageEvent) => {
    if (event.key?.includes(flagPrefix) && event.newValue) {
      toggleFeatureFlag(event.key, event.newValue);
    }
  };

  // Clear unused flags
  Object.keys(window.localStorage).forEach((key: string) => {
    if (key.startsWith('FLAG.') && !(key.replace(flagPrefix, '') in flags)) {
      window.localStorage.removeItem(key);
    }
  });

  LoggerOnce.debug('Feature flags', flags);
}

function toggleFeatureFlag(storageKey: string, value: string) {
  const key = storageKey.replace(flagPrefix, '');
  if (key in flags) {
    flags[key] = value === 'true';
  }
}

init();
