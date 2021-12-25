/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { noop } from 'lodash';

// eslint-disable-next-line no-shadow
export enum LogLevels {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

let logLevel: LogLevels = process.env.NODE_ENV === 'production' ? LogLevels.INFO : LogLevels.DEBUG;
console.log('logLevel', logLevel);

const debug =
  process.env.NODE_ENV !== 'production' && logLevel <= LogLevels.DEBUG ? console.debug : noop;
const info = logLevel <= LogLevels.INFO ? console.info : noop;
const warn = logLevel <= LogLevels.WARN ? console.warn : noop;
const error = logLevel <= LogLevels.ERROR ? console.error : noop;

function setLogLevel(level: LogLevels) {
  logLevel = level;
  console.debug(`Log level set to ${Object.keys[logLevel]}`);
}

export const Logger = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
};
