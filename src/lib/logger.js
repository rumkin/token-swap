import EventEmitter from './eventemitter';

export const ERROR = 'ERROR';
export const WARN = 'WARN';
export const LOG = 'LOG';
export const INFO = 'INFO';
export const DEBUG = 'DEBUG';

export const LEVELS = {
  [ERROR]: 10,
  [WARN]: 20,
  [LOG]: 30,
  [INFO]: 40,
  [DEBUG]: 50,
};

export function consoleReporter({level, ...entry}) {
  const fn = resolveReporter(level);
  const {module, msg, time, ...rest} = entry;

  fn('%s | %s %s: %s', level, formatDate(time), module.join('.'), msg, rest);
}

function formatDate(date) {
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  const mM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padEnd(3, '0');

  return `${yyyy}-${mM}-${dd} ${hh}:${mm}:${ss}.${ms}`;
}

function resolveReporter(level) {
  switch (level) {
    case ERROR: {
      return console.error;
    }
    case INFO: {
      return console.info;
    }
    case WARN: {
      return console.warn;
    }
    case DEBUG: {
      return console.debug;
    }
    default:
      return console.log;
  }
}

export default class Logger extends EventEmitter {
  constructor({
    name = 'app',
    module = '',
    reporters = [
      {
        level: DEBUG,
        report: consoleReporter,
      },
    ],
  } = {}) {
    super(['log']);

    this.name = name;
    this.module = module ? (Array.isArray(module) ? module : [module]) : [name];
    this.reporters = reporters;
    this.on('log', entry => {
      for (const {level, report} of this.reporters) {
        if (LEVELS[level] >= LEVELS[entry.level]) {
          report(entry);
        }
      }
    });
  }

  child(module) {
    return new Logger({
      name: this.name,
      module: [...this.module, module],
      reporters: [...this.reporters],
    });
  }

  normalizeArgs(args) {
    let msg, params;
    if (args.length > 1) {
      msg = args[0];
      params = args[1];
    } else if (typeof args[1] === 'object') {
      params = args[0];
      msg = null;
    } else {
      msg = args[0];
      params = {};
    }

    return {msg, params};
  }

  info(...args) {
    this.output(INFO, args);
  }

  log(...args) {
    this.output(LOG, args);
  }

  error(...args) {
    this.output(ERROR, args);
  }

  debug(...args) {
    this.output(DEBUG, args);
  }

  warn(...args) {
    this.output(WARN, args);
  }

  output(level, args) {
    const {msg, params} = this.normalizeArgs(args);

    const entry = {
      ...params,
      name: this.name,
      module: this.module,
      msg,
      level,
      time: new Date(),
    };

    this.emit('log', entry);
  }
}
