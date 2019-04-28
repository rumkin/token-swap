import App from './lib/app';
import Logger from './lib/logger';
import {Web3Factory} from './adapters/web3';
import {HistoryFactory} from './adapters/history';
// import {Erc20ExplorerFactory} from './services/erc20Explorer';
import {NavFactory} from './services/nav';
import {EthereumFactory} from './services/ethereum';
import {AbiEncoderFactory} from './services/abiEncoder';

export function createApp() {
  return new App({
    services: {
      history: new HistoryFactory(),
      web3: new Web3Factory(),
      // tokenExplorer: new Erc20ExplorerFactory({web3: true}),
      nav: new NavFactory(),
      abiEncoder: new AbiEncoderFactory(),
      ethereum: new EthereumFactory(),
    },
    scope: {
      logger: new Logger('app'),
    },
  });
}

export async function runApp(app, config) {
  try {
    await app.start(config);
  } catch (err) {
    await app.stop();
    throw err;
  }
  await app.waitFor('stopped');
}
