import {useLocation} from './location';
import {useApi} from './api';

export function useRouter() {
  const nav = useApi('nav');
  const [location] = useLocation();

  if (location.state && location.state.screen) {
    return [location.state.screen, location.state.params];
  }

  for (const {
    match,
    options: {screen},
  } of nav) {
    let params = match(location.pathname);
    if (params) {
      return [screen, params];
    }
  }

  return [];
}
