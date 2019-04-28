import pathToRegexp from 'path-to-regexp';

const {compile} = pathToRegexp;

export function createRoute({route, defaults = {}}) {
  const toString = compile(route);
  const keys = [];
  const regexp = pathToRegexp(route, keys);
  const keynames = keys.map(({name}) => name);

  const format = (props = {}) => {
    const params = {};
    const query = [];

    for (const [key, value] of Object.entries(props)) {
      if (keynames.includes(key)) {
        params[key] = String(value);
      } else {
        query.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
        );
      }
    }

    let postfix;
    if (query.length) {
      postfix = '?' + query.join('&');
    } else {
      postfix = '';
    }

    return (
      toString({
        ...defaults,
        ...params,
      }) + postfix
    );
  };

  const match = url => {
    let match = url.match(regexp);

    if (match) {
      const params = {};

      keynames.forEach((key, i) => {
        params[key] = match[i + 1];
      });

      return params;
    } else {
      return null;
    }
  };

  return {
    format,
    route,
    regexp,
    match,
  };
}
