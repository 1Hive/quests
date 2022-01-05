/* eslint-disable max-classes-per-file */
import { Contract } from 'ethers';

export class ContractInstanceError implements Error {
  constructor(_contractName: string, _message: string, ..._args: any[]) {
    this.message = _message;
    this.args = _args;
    this.name = _contractName;
  }

  name: string;

  stack?: string | undefined;

  message!: string;

  args?: any[];
}

export class NullableContract {
  constructor(input: Contract | ContractInstanceError) {
    if (input instanceof Contract) {
      this.instance = input;
    } else {
      this.error = input;
    }
  }

  instance?: Contract;

  error?: ContractInstanceError;
}
