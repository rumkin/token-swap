import {useReducer, useEffect, useState} from 'react';

import {useApi} from './api';

const REJECTED_MESSAGE =
  'Error: MetaMask Tx Signature: User denied transaction signature.';

const initialState = {
  state: 'none',
  isFailed: false,
  isRejected: false,
  isDone: false,
  hash: null,
  receipt: null,
  error: null,
};

function reducer(state, {type, payload}) {
  switch (type) {
    case 'reset': {
      return initialState;
    }
    case 'setSent': {
      return {
        ...state,
        state: 'sent',
      };
    }
    case 'setHash':
      return {
        ...state,
        state: 'received',
        hash: payload.hash,
      };
    case 'setReceipt':
      return {
        ...state,
        state: 'mined',
        isDone: true,
        receipt: payload.receipt,
      };
    case 'setError':
      return {
        ...state,
        isFailed: true,
        isDone: true,
        error: payload.error,
      };
    case 'setRejected':
      return {
        ...state,
        isRejected: true,
        isDone: true,
      };
    default:
      return state;
  }
}

const reset = payload => ({type: 'reset', payload});
const setSent = payload => ({type: 'setSent', payload});
const setHash = payload => ({type: 'setHash', payload});
const setReceipt = payload => ({type: 'setReceipt', payload});
const setError = payload => ({type: 'setError', payload});
const setRejected = payload => ({type: 'setRejected', payload});

export function useTransaction(tx) {
  const [state, setState] = useState();

  useEffect(
    () => {
      if (!tx) {
        return;
      }

      const update = () => setState({...tx.state});

      update();

      if (tx.state.isDone) {
        return;
      }

      const unsub = tx.events.onAll({
        transactionHash: update,
        receipt: update,
        done: update,
      });

      return unsub;
    },
    [tx],
  );

  return state;
}
