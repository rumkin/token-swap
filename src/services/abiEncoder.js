import {AbiCoder} from 'web3-eth-abi';

import Factory from '../lib/factory';
const abi = AbiCoder();

export class AbiEncoderFactory extends Factory {
  start({config}) {
    return function(params) {
      const descriptor = findDescriptor(config.abi, config.method);
      return encodeMethod(descriptor) + encodeAbi(descriptor, params);
    };
  }
}

function findConstructor(json) {
  return json.type === 'constructor';
}

function findMethod(methodSignature, json) {
  if (json.type === 'function') {
    if (json.signature === methodSignature) {
      return true;
    } else if (json.signature === methodSignature.replace('0x', '')) {
      return true;
    } else if (json.name === methodSignature) {
      return true;
    }
  }

  return false;
}

function encodeAbi(json, args) {
  let inputLength = Array.isArray(json.inputs) ? json.inputs.length : 0;

  if (inputLength !== args.length) {
    throw new Error(
      'The number of arguments is not matching the methods required number. You need to pass ' +
        inputLength +
        ' arguments.',
    );
  }

  const inputs = Array.isArray(json.inputs) ? json.inputs : [];

  return abi.encodeParameters(inputs, args).replace('0x', '');
}

function findDescriptor(abi, method) {
  let filter =
    method === 'constructor' ? findConstructor : findMethod.bind(null, method);

  return abi.find(filter);
}

function encodeMethod(json) {
  if (json.type === 'constructor') {
    return '';
  } else {
    return abi.encodeFunctionSignature(json);
  }
}
