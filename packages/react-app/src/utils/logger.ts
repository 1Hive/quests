/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

// eslint-disable-next-line no-shadow
export enum LogLevels {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

let logLevel: LogLevels;

function debug(message: any, ...params: any[]) {
  if (process.env.NODE_ENV === 'production' || logLevel < LogLevels.DEBUG) return;
  params.length ? console.debug(message, params) : console.debug(message);
}

function info(message: any, ...params: any[]) {
  if (logLevel > LogLevels.INFO) return;
  params.length ? console.info(message, params) : console.info(message);
}

function warn(message: any, ...params: any[]) {
  if (logLevel > LogLevels.WARN) return;
  params.length ? console.warn(message, params) : console.warn(message);
}

function error(message: any, ...params: any[]) {
  if (logLevel > LogLevels.ERROR) return;
  params.length ? console.error(message, params) : console.error(message);
}

function setLogLevel(level: LogLevels) {
  logLevel = level;
  console.debug(`Log level set to ${Object.keys[logLevel]}`);
}

setLogLevel(process.env.NODE_ENV === 'production' ? LogLevels.INFO : LogLevels.DEBUG);

export const Logger = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
};
