import { Logger } from './logger';

export function wrapError(message: String, obj: any) {
  const objJson = JSON.stringify(obj, null, 2);
  return Error(`Error : ${message}\n${objJson}`);
}

export function computeTransactionErrorMessage(error: any) {
  Logger.exception(error, 'An error occured during the transaction');
  if (METAMASK_POSSIBLE_ERRORS[error.code?.toString()])
    return METAMASK_POSSIBLE_ERRORS[error.code?.toString()].message;
  return 'Something went wrong with the transaction.';
}

/**
 * https://ethereum.stackexchange.com/a/110699
 */
const METAMASK_POSSIBLE_ERRORS = {
  '-32700': {
    standard: 'JSON RPC 2.0',
    message:
      'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
  },
  '-32600': {
    standard: 'JSON RPC 2.0',
    message: 'The JSON sent is not a valid Request object',
  },
  '-32601': {
    standard: 'JSON RPC 2.0',
    message: 'The method does not exist / is not available',
  },
  '-32602': {
    standard: 'JSON RPC 2.0',
    message: 'Invalid method parameter(s)',
  },
  '-32603': {
    standard: 'JSON RPC 2.0',
    message: 'Internal JSON-RPC error',
  },
  '-32000': {
    standard: 'EIP-1474',
    message: 'Invalid input',
  },
  '-32001': {
    standard: 'EIP-1474',
    message: 'Resource not found',
  },
  '-32002': {
    standard: 'EIP-1474',
    message: 'Resource unavailable',
  },
  '-32003': {
    standard: 'EIP-1474',
    message: 'Transaction rejected',
  },
  '-32004': {
    standard: 'EIP-1474',
    message: 'Method not supported',
  },
  '-32005': {
    standard: 'EIP-1474',
    message: 'Request limit exceeded',
  },
  '4001': {
    standard: 'EIP-1193',
    message: 'User rejected the request',
  },
  '4100': {
    standard: 'EIP-1193',
    message: 'The requested account and/or method has not been authorized by the user',
  },
  '4200': {
    standard: 'EIP-1193',
    message: 'The requested method is not supported by this Ethereum provider',
  },
};
