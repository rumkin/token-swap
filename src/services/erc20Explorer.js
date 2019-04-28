import Factory from '../lib/factory';

export class Erc20ExplorerFactory extends Factory {
  static deps = ['web3'];

  start({config, scope: {web3}}) {
    return new Erc20Explorer({
      web3,
      config,
    });
  }
}

class Erc20Explorer {
  constructor({config, web3}) {
    this.config = config;
    this._web3 = web3;
  }

  get web3() {
    return this._web3;
  }

  getName(address) {
    // ...
  }
}
