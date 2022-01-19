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

function registerAndCall(_this: any, fn: Function, message: any, args: any[]) {
  let identifier: string;
  if (message instanceof Error) {
    identifier = message.message;
  } else {
    identifier = JSON.stringify({ message, args });
  }
  const key = `${logLevel}-${fn.name}-${identifier}`;
  if (!callMap.has(key)) {
    callMap.set(key, { message, args });
    if (args.length) return fn.call(_this, message, args);
    return fn.call(_this, message);
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
  debug: (message?: any, ...optionalParams: any[]) =>
    registerAndCall(this, debug, message, optionalParams),
  info: (message?: any, ...optionalParams: any[]) =>
    registerAndCall(this, info, message, optionalParams),
  warn: (message?: any, ...optionalParams: any[]) =>
    registerAndCall(this, warn, message, optionalParams),
  error: (message?: any, ...optionalParams: any[]) =>
    registerAndCall(this, error, message, optionalParams),
};
