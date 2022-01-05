// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Register extends ethereum.Event {
  get params(): Register__Params {
    return new Register__Params(this);
  }
}

export class Register__Params {
  _event: Register;

  constructor(event: Register) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class ScriptResult extends ethereum.Event {
  get params(): ScriptResult__Params {
    return new ScriptResult__Params(this);
  }
}

export class ScriptResult__Params {
  _event: ScriptResult;

  constructor(event: ScriptResult) {
    this._event = event;
  }

  get executor(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get script(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get input(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }

  get returnData(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }
}

export class RecoverToVault extends ethereum.Event {
  get params(): RecoverToVault__Params {
    return new RecoverToVault__Params(this);
  }
}

export class RecoverToVault__Params {
  _event: RecoverToVault;

  constructor(event: RecoverToVault) {
    this._event = event;
  }

  get vault(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get token(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class BrightIdRegister__userRegistrationsResult {
  value0: Address;
  value1: BigInt;
  value2: boolean;

  constructor(value0: Address, value1: BigInt, value2: boolean) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromBoolean(this.value2));
    return map;
  }
}

export class BrightIdRegister extends ethereum.SmartContract {
  static bind(address: Address): BrightIdRegister {
    return new BrightIdRegister("BrightIdRegister", address);
  }

  supportsInterface(_interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(_interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(_interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(_interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  hasInitialized(): boolean {
    let result = super.call("hasInitialized", "hasInitialized():(bool)", []);

    return result[0].toBoolean();
  }

  try_hasInitialized(): ethereum.CallResult<boolean> {
    let result = super.tryCall("hasInitialized", "hasInitialized():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  userRegistrations(
    param0: Address
  ): BrightIdRegister__userRegistrationsResult {
    let result = super.call(
      "userRegistrations",
      "userRegistrations(address):(address,uint256,bool)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new BrightIdRegister__userRegistrationsResult(
      result[0].toAddress(),
      result[1].toBigInt(),
      result[2].toBoolean()
    );
  }

  try_userRegistrations(
    param0: Address
  ): ethereum.CallResult<BrightIdRegister__userRegistrationsResult> {
    let result = super.tryCall(
      "userRegistrations",
      "userRegistrations(address):(address,uint256,bool)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new BrightIdRegister__userRegistrationsResult(
        value[0].toAddress(),
        value[1].toBigInt(),
        value[2].toBoolean()
      )
    );
  }

  getEVMScriptExecutor(_script: Bytes): Address {
    let result = super.call(
      "getEVMScriptExecutor",
      "getEVMScriptExecutor(bytes):(address)",
      [ethereum.Value.fromBytes(_script)]
    );

    return result[0].toAddress();
  }

  try_getEVMScriptExecutor(_script: Bytes): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getEVMScriptExecutor",
      "getEVMScriptExecutor(bytes):(address)",
      [ethereum.Value.fromBytes(_script)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getRecoveryVault(): Address {
    let result = super.call(
      "getRecoveryVault",
      "getRecoveryVault():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_getRecoveryVault(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getRecoveryVault",
      "getRecoveryVault():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  brightIdContext(): Bytes {
    let result = super.call(
      "brightIdContext",
      "brightIdContext():(bytes32)",
      []
    );

    return result[0].toBytes();
  }

  try_brightIdContext(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "brightIdContext",
      "brightIdContext():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  UPDATE_SETTINGS_ROLE(): Bytes {
    let result = super.call(
      "UPDATE_SETTINGS_ROLE",
      "UPDATE_SETTINGS_ROLE():(bytes32)",
      []
    );

    return result[0].toBytes();
  }

  try_UPDATE_SETTINGS_ROLE(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "UPDATE_SETTINGS_ROLE",
      "UPDATE_SETTINGS_ROLE():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  hasUniqueUserId(_brightIdUser: Address): boolean {
    let result = super.call(
      "hasUniqueUserId",
      "hasUniqueUserId(address):(bool)",
      [ethereum.Value.fromAddress(_brightIdUser)]
    );

    return result[0].toBoolean();
  }

  try_hasUniqueUserId(_brightIdUser: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "hasUniqueUserId",
      "hasUniqueUserId(address):(bool)",
      [ethereum.Value.fromAddress(_brightIdUser)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  brightIdVerifiers(param0: BigInt): Address {
    let result = super.call(
      "brightIdVerifiers",
      "brightIdVerifiers(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toAddress();
  }

  try_brightIdVerifiers(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "brightIdVerifiers",
      "brightIdVerifiers(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  registrationPeriod(): BigInt {
    let result = super.call(
      "registrationPeriod",
      "registrationPeriod():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_registrationPeriod(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "registrationPeriod",
      "registrationPeriod():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getBrightIdVerifiers(): Array<Address> {
    let result = super.call(
      "getBrightIdVerifiers",
      "getBrightIdVerifiers():(address[])",
      []
    );

    return result[0].toAddressArray();
  }

  try_getBrightIdVerifiers(): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "getBrightIdVerifiers",
      "getBrightIdVerifiers():(address[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  allowRecoverability(token: Address): boolean {
    let result = super.call(
      "allowRecoverability",
      "allowRecoverability(address):(bool)",
      [ethereum.Value.fromAddress(token)]
    );

    return result[0].toBoolean();
  }

  try_allowRecoverability(token: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "allowRecoverability",
      "allowRecoverability(address):(bool)",
      [ethereum.Value.fromAddress(token)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  appId(): Bytes {
    let result = super.call("appId", "appId():(bytes32)", []);

    return result[0].toBytes();
  }

  try_appId(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("appId", "appId():(bytes32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getInitializationBlock(): BigInt {
    let result = super.call(
      "getInitializationBlock",
      "getInitializationBlock():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getInitializationBlock(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getInitializationBlock",
      "getInitializationBlock():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  canPerform(_sender: Address, _role: Bytes, _params: Array<BigInt>): boolean {
    let result = super.call(
      "canPerform",
      "canPerform(address,bytes32,uint256[]):(bool)",
      [
        ethereum.Value.fromAddress(_sender),
        ethereum.Value.fromFixedBytes(_role),
        ethereum.Value.fromUnsignedBigIntArray(_params)
      ]
    );

    return result[0].toBoolean();
  }

  try_canPerform(
    _sender: Address,
    _role: Bytes,
    _params: Array<BigInt>
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "canPerform",
      "canPerform(address,bytes32,uint256[]):(bool)",
      [
        ethereum.Value.fromAddress(_sender),
        ethereum.Value.fromFixedBytes(_role),
        ethereum.Value.fromUnsignedBigIntArray(_params)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getEVMScriptRegistry(): Address {
    let result = super.call(
      "getEVMScriptRegistry",
      "getEVMScriptRegistry():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_getEVMScriptRegistry(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getEVMScriptRegistry",
      "getEVMScriptRegistry():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isVerified(_brightIdUser: Address): boolean {
    let result = super.call("isVerified", "isVerified(address):(bool)", [
      ethereum.Value.fromAddress(_brightIdUser)
    ]);

    return result[0].toBoolean();
  }

  try_isVerified(_brightIdUser: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isVerified", "isVerified(address):(bool)", [
      ethereum.Value.fromAddress(_brightIdUser)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  uniqueUserId(_brightIdUser: Address): Address {
    let result = super.call("uniqueUserId", "uniqueUserId(address):(address)", [
      ethereum.Value.fromAddress(_brightIdUser)
    ]);

    return result[0].toAddress();
  }

  try_uniqueUserId(_brightIdUser: Address): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "uniqueUserId",
      "uniqueUserId(address):(address)",
      [ethereum.Value.fromAddress(_brightIdUser)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  kernel(): Address {
    let result = super.call("kernel", "kernel():(address)", []);

    return result[0].toAddress();
  }

  try_kernel(): ethereum.CallResult<Address> {
    let result = super.tryCall("kernel", "kernel():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isPetrified(): boolean {
    let result = super.call("isPetrified", "isPetrified():(bool)", []);

    return result[0].toBoolean();
  }

  try_isPetrified(): ethereum.CallResult<boolean> {
    let result = super.tryCall("isPetrified", "isPetrified():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  verificationTimestampVariance(): BigInt {
    let result = super.call(
      "verificationTimestampVariance",
      "verificationTimestampVariance():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_verificationTimestampVariance(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "verificationTimestampVariance",
      "verificationTimestampVariance():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class RegisterCall extends ethereum.Call {
  get inputs(): RegisterCall__Inputs {
    return new RegisterCall__Inputs(this);
  }

  get outputs(): RegisterCall__Outputs {
    return new RegisterCall__Outputs(this);
  }
}

export class RegisterCall__Inputs {
  _call: RegisterCall;

  constructor(call: RegisterCall) {
    this._call = call;
  }

  get _addrs(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get _timestamps(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get _v(): Array<i32> {
    return this._call.inputValues[2].value.toI32Array();
  }

  get _r(): Array<Bytes> {
    return this._call.inputValues[3].value.toBytesArray();
  }

  get _s(): Array<Bytes> {
    return this._call.inputValues[4].value.toBytesArray();
  }

  get _registerAndCall(): Address {
    return this._call.inputValues[5].value.toAddress();
  }

  get _functionCallData(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }
}

export class RegisterCall__Outputs {
  _call: RegisterCall;

  constructor(call: RegisterCall) {
    this._call = call;
  }
}

export class SetVerificationTimestampVarianceCall extends ethereum.Call {
  get inputs(): SetVerificationTimestampVarianceCall__Inputs {
    return new SetVerificationTimestampVarianceCall__Inputs(this);
  }

  get outputs(): SetVerificationTimestampVarianceCall__Outputs {
    return new SetVerificationTimestampVarianceCall__Outputs(this);
  }
}

export class SetVerificationTimestampVarianceCall__Inputs {
  _call: SetVerificationTimestampVarianceCall;

  constructor(call: SetVerificationTimestampVarianceCall) {
    this._call = call;
  }

  get _verificationTimestampVariance(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetVerificationTimestampVarianceCall__Outputs {
  _call: SetVerificationTimestampVarianceCall;

  constructor(call: SetVerificationTimestampVarianceCall) {
    this._call = call;
  }
}

export class SetRegistrationPeriodCall extends ethereum.Call {
  get inputs(): SetRegistrationPeriodCall__Inputs {
    return new SetRegistrationPeriodCall__Inputs(this);
  }

  get outputs(): SetRegistrationPeriodCall__Outputs {
    return new SetRegistrationPeriodCall__Outputs(this);
  }
}

export class SetRegistrationPeriodCall__Inputs {
  _call: SetRegistrationPeriodCall;

  constructor(call: SetRegistrationPeriodCall) {
    this._call = call;
  }

  get _registrationPeriod(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetRegistrationPeriodCall__Outputs {
  _call: SetRegistrationPeriodCall;

  constructor(call: SetRegistrationPeriodCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _brightIdContext(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _brightIdVerifiers(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }

  get _registrationPeriod(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _verificationTimestampVariance(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class TransferToVaultCall extends ethereum.Call {
  get inputs(): TransferToVaultCall__Inputs {
    return new TransferToVaultCall__Inputs(this);
  }

  get outputs(): TransferToVaultCall__Outputs {
    return new TransferToVaultCall__Outputs(this);
  }
}

export class TransferToVaultCall__Inputs {
  _call: TransferToVaultCall;

  constructor(call: TransferToVaultCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferToVaultCall__Outputs {
  _call: TransferToVaultCall;

  constructor(call: TransferToVaultCall) {
    this._call = call;
  }
}

export class SetBrightIdVerifiersCall extends ethereum.Call {
  get inputs(): SetBrightIdVerifiersCall__Inputs {
    return new SetBrightIdVerifiersCall__Inputs(this);
  }

  get outputs(): SetBrightIdVerifiersCall__Outputs {
    return new SetBrightIdVerifiersCall__Outputs(this);
  }
}

export class SetBrightIdVerifiersCall__Inputs {
  _call: SetBrightIdVerifiersCall;

  constructor(call: SetBrightIdVerifiersCall) {
    this._call = call;
  }

  get _brightIdVerifiers(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class SetBrightIdVerifiersCall__Outputs {
  _call: SetBrightIdVerifiersCall;

  constructor(call: SetBrightIdVerifiersCall) {
    this._call = call;
  }
}