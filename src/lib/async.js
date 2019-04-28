import EventEmitter from './eventemitter';

export function prom(fn) {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export function valve() {
  let isOpened = true;
  return {
    use: fn => (...args) => {
      if (isOpened) {
        fn(...args);
      }
    },
    close: () => {
      isOpened = false;
    },
    isOpened: () => isOpened,
  };
}

export function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const RESOLVE = Symbol('resolve');
const REJECT = Symbol('reject');

export class Promevent extends EventEmitter {
  constructor(events) {
    super([...events, 'done', 'abort', 'success', 'error']);

    this.promise = new Promise((resolve, reject) => {
      this[RESOLVE] = resolve;
      this[REJECT] = reject;
    });

    this.isDone = false;
    this.isAborted = false;
    this.isResolved = false;
    this.isRejected = false;
  }

  then(...args) {
    return this.promise.then(...args);
  }

  catch(...args) {
    return this.promise.catch(...args);
  }

  finally(...args) {
    return this.promise.finally(...args);
  }

  abort() {
    if (this.isDone) {
      return;
    }
    this.isAborted = true;
    this.isDone = true;
    this.emit('abort');
    this.emit('done');
    this[REJECT](new Error('aborted'));
  }

  resolve(result) {
    if (this.isDone) {
      return;
    }
    this.isResolved = true;
    this.isDone = true;
    this.emit('success', result);
    this.emit('done');
    this[RESOLVE](result);
  }

  reject(error) {
    if (this.isDone) {
      return;
    }
    this.isRejected = true;
    this.isDone = true;
    this.emit('error', error);
    this.emit('done');
    this[REJECT](error);
  }
}
