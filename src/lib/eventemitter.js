const ID = Symbol('EventID');
const EVENTS = Symbol('Events');
const INDEX = Symbol('Index');

export default class EventEmitter {
  static EVENTS = EVENTS;
  constructor(events = []) {
    if (!Array.isArray(events)) {
      throw new Error('Argument #1 should be an Array');
    }

    this[ID] = 0;
    this[EVENTS] = createEvents(events);
    this[INDEX] = Object.create({});
  }

  requireEvent(event) {
    if (event in this[EVENTS] === false) {
      throw new Error(`Unknown event ${event}`);
    }
  }

  on(event, listener, ...args) {
    this.requireEvent(event);

    const id = ++this[ID];
    const record = {
      event,
      id,
      listener,
      args,
    };

    this[EVENTS][event].push(id);
    this[INDEX][id] = record;

    return () => {
      this._removeListener(id);
    };
  }

  once(event, listener, ...args) {
    const id = this[ID] + 1;
    return this.on(
      event,
      function(...a) {
        listener.call(this, ...a);
        this._removeListener(id);
      },
      ...args,
    );
  }

  onAll(map) {
    return batchListen(this, map);
  }

  off(event) {
    this.requireEvent(event);
    this[EVENTS][event].forEach(id => {
      delete this[INDEX][id];
    });
    this[EVENTS][event] = [];
  }

  emit(event, ...args) {
    this.requireEvent(event);

    this[EVENTS][event].forEach(id => {
      const item = this[INDEX][id];
      item.listener.call(this, ...item.args, ...args);
    });
  }

  _removeListener(id) {
    if (!(id in this[INDEX])) {
      return;
    }

    const {event} = this[INDEX][id];
    this[EVENTS][event] = this[EVENTS][event].filter(value => value !== id);
    delete this[INDEX][id];
  }

  waitFor(event) {
    this.requireEvent(event);

    return new Promise(resolve => {
      this.once(event, resolve);
    });
  }

  waitForAny(events) {
    for (const event of events) {
      this.requireEvent(event);
    }
    const unsubs = new Array(events.length);
    let proms = events.map(
      (event, i) =>
        new Promise(resolve => {
          unsubs[i] = this.once(event, resolve);
        }),
    );

    return Promise.race(proms).then(() => {
      for (const unsub of unsubs) {
        unsub();
      }
    });
  }

  waitForAll(events) {
    for (const event of events) {
      this.requireEvent(event);
    }

    let proms = events.map(
      (event, i) =>
        new Promise(resolve => {
          this.once(event, resolve);
        }),
    );

    return Promise.all(proms);
  }
}

function createEvents(events) {
  const map = Object.create(null);

  for (const i in events) {
    const event = events[i];
    if (typeof event !== 'string') {
      throw new Error('Event name should be a string');
    }
    map[event] = [];
  }

  return map;
}

export function batchListen(target, events) {
  const unsubs = [];

  for (const [event, listener] of Object.entries(events)) {
    unsubs.push(target.on(event, listener));
  }

  return () => {
    for (const unsub of unsubs) {
      unsub();
    }
  };
}
