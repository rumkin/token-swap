import {AbiCoder} from 'web3-eth-abi';

import Factory from '../lib/factory';
import EventEmitter from '../lib/eventemitter';
import {prom, delay} from '../lib/async';

const abiCoder = AbiCoder();

const REJECTED_MESSAGE =
  'Error: MetaMask Tx Signature: User denied transaction signature.';

export class EthereumFactory extends Factory {
  static deps = ['web3'];

  async start({config, scope: {web3, logger}}) {
    if (!web3) {
      return {
        connected: false,
        accounts: [],
        transactions: [],
        sendTransaction() {
          return Promise.reject(new Error('Not connected'));
        },
        getTransactionReceipt() {
          return Promise.reject(new Error('Not connected'));
        },
        getTransaction(id) {},
      };
    }

    let counters = {
      tx: 0,
    };

    return {
      connected: true,
      accounts: web3.eth.accounts,
      transactions: [],
      getTransactionReceipt(hash) {
        logger.info('get_receipt', {hash});
        return prom(cb => web3.eth.getTransactionReceipt(hash, cb));
      },
      _sendTransaction(params) {
        return prom(cb => web3.eth.sendTransaction(params, cb));
      },
      sendTransaction(params, contract) {
        logger.info('send_transaction', {params});

        let abi = null;
        if (contract) {
          abi = config.contracts[contract];
          if (!abi) {
            throw new Error(`Unknown contract type ${contract}`);
          }
        }

        const id = ++counters.tx;
        const ee = new EventEmitter([
          'transactionHash',
          'receipt',
          'success',
          'reject',
          'error',
          'done',
        ]);

        const tx = {
          id,
          promise: null,
          events: ee,
          state: {
            status: null,
            isError: false,
            isDone: false,
            isRejected: false,
            transactionHash: null,
            receipt: null,
            error: null,
          },
        };

        this.transactions.push(tx);

        const promise = this._sendTransaction(params)
          .then(transactionHash => {
            tx.state.transactionHash = transactionHash;
            tx.state.status = 'sent';
            ee.emit('transactionHash', transactionHash);

            const loadReceipt = async (hash, retries) => {
              await delay(2000);
              let receipt;
              try {
                receipt = await this.getTransactionReceipt(hash);
              } catch (error) {
                logger.error('get_transaction_receipt', {error});
                // FIXME Check if error is restorable and continue execution.
                throw error;
              }

              if (receipt) {
                return receipt;
              } else if (retries > 1) {
                return loadReceipt(hash, retries - 1);
              } else {
                throw new Error('receipt_timed_out');
              }
            };

            return loadReceipt(transactionHash, 60);
          })
          .then(receipt => {
            tx.state.status = 'accepted';
            tx.state.receipt = receipt;

            if (abi) {
              receipt.events = decodeLogs(abi, receipt.logs);
            } else {
              receipt.events = {};
            }

            ee.emit('receipt', receipt);
            ee.emit('success');
            return receipt;
          })
          .catch(error => {
            if (error.message === REJECTED_MESSAGE) {
              tx.state.status = 'rejected';
              tx.state.isRejected = true;
              ee.emit('reject');
            } else {
              tx.state.status = 'failed';
              tx.state.isError = true;
              tx.state.error = error;
              ee.emit('error', error);
            }
          })
          .finally(() => {
            logger.info('send_transaction_done', tx.state);
            tx.state.isDone = true;
            ee.emit('done');
          });

        tx.promise = promise;

        return tx;
      },
      getTransaction(id) {
        return this.transactions.find(item => item.id === id);
      },
    };
  }
}

function getAbiEvents(abi) {
  return abi.reduce((events, item) => {
    if (item.type === 'event' && item.anonymous === false) {
      events[abiCoder.encodeEventSignature(item)] = item;
    }
    return events;
  }, {});
}

function decodeLogs(abi, logs) {
  const events = getAbiEvents(abi);
  return logs.reduce((result, entry) => {
    if (entry.topics.length) {
      if (entry.topics[0] in events) {
        const descriptor = events[entry.topics[0]];
        result[descriptor.name] = result[descriptor.name] || [];
        result[descriptor.name].push(
          abiCoder.decodeLog(
            descriptor.inputs,
            entry.data,
            entry.topics.slice(1),
          ),
        );
      }
    }
    return result;
  }, {});
}
