import 'antd/dist/antd.css';
import './styles.css';

import {createApp, runApp} from './app';
import {mountApp, unmountApp} from './view';

import SwapRegistry from './abi/SwapRegistry';

async function main(config, root) {
  const app = createApp();

  console.log(app);

  app.once('started', scope => {
    mountApp(app, root);
  });

  app.once('stopped', () => {
    unmountApp(root);
  });

  let hasError = false;
  app.once('error', () => {
    hasError = true;
  });

  await runApp(app, config);

  return hasError;
}

main(
  {
    counter: {
      i: 0,
    },
    nav: {
      routes: {
        home: {
          route: '/',
          screen: 'home',
        },
        builder: {
          route: '/builder',
          screen: 'builder',
        },
        contract: {
          route: '/contract/:address',
          screen: 'contract',
        },
        notFound: {
          route: '/(.*)',
          screen: 'notFound',
        },
      },
    },
    abiEncoder: {
      method: 'createSwap',
      abi: SwapRegistry,
    },
    ethereum: {
      contracts: {
        SwapRegistry,
      },
      addressbook: {
        SwapRegistry: {
          network: 'rinkeby',
          address: '0xe0f93b0aaca34cef329d5ed2d42ce1532cb44f37',
          abi: SwapRegistry,
        },
      },
    },
  },
  document.getElementById('app'),
)
  .finally(() => {
    console.log('Closed');
  })
  .catch(console.error);
