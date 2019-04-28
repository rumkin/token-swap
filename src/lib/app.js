import toposort from 'toposort';

import EventEmitter from './eventemitter';

export default class App extends EventEmitter {
  constructor({services, scope: {logger, ...scope}} = {}) {
    super(['start', 'started', 'stop', 'stopped', 'error']);

    this._isRunning = false;
    this._isStarting = false;
    this._isStopping = false;

    this.order = [];
    this.scope = {
      logger,
      ...scope,
    };
    this.services = services;

    const deps = [];

    for (const [name, factory] of Object.entries(services)) {
      deps.push(['', name]);

      for (const [localName, dep] of Object.entries(factory.layout)) {
        let depName = dep === true ? localName : dep;
        if (!services.hasOwnProperty(depName)) {
          throw new Error(
            `Unknown dependency "${depName}" of component "${localName}."`,
          );
        }
        deps.push([name, depName]);
      }
    }

    this.order = toposort(deps)
      .slice(1)
      .reverse();
    this.logger = logger;
  }

  get isRunning() {
    return this._isRunning;
  }

  get isStarting() {
    return this._isStarting;
  }

  get isStopping() {
    return this._isSopping;
  }

  async start(config = {}) {
    if (this.isRunning || this.isStarting) {
      throw new Error('Already started');
    }

    this.emit('start');

    this._isStarting = true;

    const {scope, services, order} = this;

    try {
      for (const name of order) {
        const factory = services[name];

        const localScope = {
          app: this,
          logger: scope.logger.child(name),
        };
        for (const [localName, scopeName] of Object.entries(factory.layout)) {
          localScope[localName] =
            scope[scopeName === true ? localName : scopeName];
        }
        scope[name] = await services[name].start({
          name,
          config: config[name] || {},
          scope: localScope,
        });
      }
    } finally {
      this._isStarting = false;
    }

    this._isRunning = true;

    this.logger.info('app_started');
    this.emit('started', scope);
    return scope;
  }

  async stop() {
    if (!this.isRunning || this.isStopping) {
      return;
    }

    this.emit('stop');
    this._isStopping = true;

    const {services, scope, order} = this;

    try {
      for (const name of order) {
        await services[name].stop(scope[name]);
        delete scope[name];
      }
    } finally {
      this._isStopping = false;
    }

    this._isRunning = false;

    this.logger.info('app_stopped');
    this.emit('stopped');
  }
}
