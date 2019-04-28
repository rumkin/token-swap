import {createBrowserHistory} from 'history';

import Factory from '../lib/factory';

export class HistoryFactory extends Factory {
  start(config) {
    return createBrowserHistory(config);
  }
}
