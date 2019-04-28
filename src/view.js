import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/root';

export function mountApp(app, root) {
  ReactDOM.render(<Root app={app} />, root);
}

export function unmountApp(root) {
  ReactDOM.unmountComponentAtNode(root);
}
