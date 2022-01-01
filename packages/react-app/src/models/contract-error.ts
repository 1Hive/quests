export class ContractError implements Error {
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
