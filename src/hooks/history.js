import {useEffect, useState} from 'react';

import {useApi} from './api';

export function useHistory() {
  return useApi('history');
}

const state = {
  n: 0,
  messages: [],
  unblock: null,
};

export function useLock(message, enabled) {
  const history = useHistory();
  const item = {
    n: ++state.n,
    message,
  };

  useEffect(() => {
    if (!enabled) {
      return;
    }

    state.messages.push(item);
    if (state.messages.length === 1) {
      state.unblock = history.block(() => {
        return state.messages[state.messages.length - 1].message;
      });
    }

    return () => {
      if (state.messages.length === 1) {
        state.unblock();
        state.unblock = null;
      }
      state.messages = state.messages.filter(({n}) => item.n !== n);
    };
  });
}
