import Factory from '../lib/factory';
import {createRoute} from '../lib/routes';

export class NavFactory extends Factory {
  static deps = ['history'];

  start({config: {prefix = '', urlBase, routes}, scope: {history}}) {
    const list = [];
    const nav = {
      [Symbol.iterator]() {
        return list[Symbol.iterator]();
      },
    };
    if (!urlBase) {
      urlBase = `${window.location.protocol}//${window.location.host}`;
    }

    for (const [name, options] of Object.entries(routes)) {
      const {format, match} = createRoute({
        route: prefix + options.route,
        defaults: options.defaults || {},
      });

      function goTo(params) {
        history.push(format(params), {
          screen: options.screen,
          params,
        });
      }

      nav[name] = goTo;
      goTo.toUrl = params => new URL(format(params), urlBase);
      goTo.match = match;
      list.push({
        name,
        match,
        options,
      });
    }

    return Object.freeze(nav);
  }
}
