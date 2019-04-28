import React from 'react';

import {useApi} from '../hooks/api';

export default function Link({target, params, children, ...props}) {
  const nav = useApi('nav');
  const url = nav[target].toUrl(params).toString();

  return (
    <a
      href={url}
      {...props}
      onClick={e => {
        e.preventDefault();
        nav[target](params);
      }}
    >
      {React.Children.count(children) > 0 ? children : url}
    </a>
  );
}
