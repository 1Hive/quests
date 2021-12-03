/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

// eslint-disable-next-line no-shadow
export enum LogLevels {
  NONE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

let logLevel: LogLevels = process.env.NODE_ENV === 'production' ? LogLevels.INFO : LogLevels.DEBUG;

function debug(message: any, ...params: any[]) {
  if (process.env.NODE_ENV === 'production' && logLevel < LogLevels.DEBUG) return;
  console.debug(message, params);
}

function info(message: any, ...params: any[]) {
  if (logLevel < LogLevels.INFO) return;
  console.info(message, params);
}

function warn(message: any, ...params: any[]) {
  if (logLevel < LogLevels.WARN) return;
  console.warn(message, params);
}

function error(message: any, ...params: any[]) {
  if (logLevel < LogLevels.ERROR) return;
  console.error(message, params);
}

function setLogLevel(level: LogLevels) {
  logLevel = level;
}

export const Logger = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
};
