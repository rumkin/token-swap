import Factory from '../lib/factory';

export class Web3Factory extends Factory {
  start() {
    return window.web3;
  }
}
