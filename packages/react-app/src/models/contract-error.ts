export class ContractInstanceError implements Error {
  constructor(_contractName: string, _message: string, error?: any) {
    this.message = _message;
    this.error = error;
    this.name = _contractName;
  }

  name: string;

  message!: string;

  error?: Error;
}
