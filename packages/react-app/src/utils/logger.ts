/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { noop } from 'lodash';
import { string } from 'prop-types';

// eslint-disable-next-line no-shadow
export enum LogLevels {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

let logLevel: LogLevels = process.env.NODE_ENV === 'production' ? LogLevels.INFO : LogLevels.DEBUG;
const callMap = new Map<string, any>();
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

function registerAndCall(fn: Function, args: any[]) {
  const findResult = args.find((x) => typeof x.message === 'string');
  const arg = findResult?.message ?? JSON.stringify(args);
  const key = `${fn.name}-${arg}`;
  if (!callMap.has(key)) {
    callMap.set(key, arg);
    return fn;
  }
  return noop;
}

export const Logger = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
};
export const LoggerOnce = {
  debug: (...args: any[]) => registerAndCall(debug, args),
  info: (...args: any[]) => registerAndCall(info, args),
  warn: (...args: any[]) => registerAndCall(warn, args),
  error: (...args: any[]) => registerAndCall(error, args),
  setLogLevel: (...args: any[]) => registerAndCall(setLogLevel, args),
};
