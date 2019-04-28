import {AbiCoder} from 'web3-eth-abi';
import SwapRegistry from '../abi/SwapRegistry';

const abiCoder = AbiCoder();

const receipt = {
  blockHash:
    '0xa9293a5f83ecaa34c423f749f84465c87e7e3db17f6a5f12134c4b7dde70a715',
  blockNumber: 4003051,
  contractAddress: null,
  cumulativeGasUsed: 1048900,
  from: '0xa5d6420d256573b59658424c2f1c72c101ba3a79',
  gasUsed: 372454,
  logs: [
    {
      address: '0xe0f93b0aaca34cef329d5ed2d42ce1532cb44f37',
      blockHash:
        '0xa9293a5f83ecaa34c423f749f84465c87e7e3db17f6a5f12134c4b7dde70a715',
      blockNumber: 4003051,
      data:
        '0x0000000000000000000000002ff50d6678d0ebbc85155289c405e3224908ee0000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001',
      logIndex: 4,
      removed: false,
      topics: [
        '0x9fd4ed25c75b1d1ce8754b7c4c7fac615c91e3b6045c9c80812fe19aea191c7f',
      ],
      transactionHash:
        '0x169804228a22670c58d74f05ce530c08a22c8c39a5c295bbae9eb3f2a7ce8d05',
      transactionIndex: 5,
    },
  ],
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000010000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: '0x1',
  to: '0xe0f93b0aaca34cef329d5ed2d42ce1532cb44f37',
  transactionHash:
    '0x169804228a22670c58d74f05ce530c08a22c8c39a5c295bbae9eb3f2a7ce8d05',
  transactionIndex: 5,
};

function getAbiEvents(abi) {
  return abi.reduce((events, item) => {
    if (item.type === 'event' && item.anonymous === false) {
      events[abiCoder.encodeEventSignature(item)] = item;
    }
    return events;
  }, {});
}

function decodeLog(abi, logs) {
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

try {
  console.log(decodeLog(SwapRegistry, receipt.logs));
} catch (err) {
  console.error(err);
}
