import {useApp} from './app';

export function useApi(name) {
  const {scope} = useApp();
  if (name in scope === false) {
    throw new Error(`Unknown API name ${name}`);
  }

  return scope[name];
}
