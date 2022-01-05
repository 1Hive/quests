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

export class JurorActivated extends ethereum.Event {
  get params(): JurorActivated__Params {
    return new JurorActivated__Params(this);
  }
}

export class JurorActivated__Params {
  _event: JurorActivated;

  constructor(event: JurorActivated) {
    this._event = event;
  }

  get juror(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get fromTermId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get sender(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class JurorDeactivationRequested extends ethereum.Event {
  get params(): JurorDeactivationRequested__Params {
    return new JurorDeactivationRequested__Params(this);
  }
}

export class JurorDeactivationRequested__Params {
  _event: JurorDeactivationRequested;

  constructor(event: JurorDeactivationRequested) {
    this._event = event;
  }

  get juror(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get availableTermId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class JurorDeactivationProcessed extends ethereum.Event {
  get params(): JurorDeactivationProcessed__Params {
    return new JurorDeactivationProcessed__Params(this);
  }
}

export class JurorDeactivationProcessed__Params {
  _event: JurorDeactivationProcessed;

  constructor(event: JurorDeactivationProcessed) {
    this._event = event;
  }

  get juror(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get availableTermId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get processedTermId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class JurorDeactivationUpdated extends ethereum.Event {
  get params(): JurorDeactivationUpdated__Params {
    return new JurorDeactivationUpdated__Params(this);
  }
}

export class JurorDeactivationUpdated__Params {
  _event: JurorDeactivationUpdated;

  constructor(event: JurorDeactivationUpdated) {
    this._event = event;
  }

  get juror(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get availableTermId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get updateTermId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class JurorBalanceLocked extends ethereum.Event {
  get params(): JurorBalanceLocked__Params {
    return new JurorBalanceLocked__Params(this);
  }
}

export class JurorBalanceLocked__Params {
  _event: JurorBalanceLocked;

  constructor(event: JurorBalanceLocked) {
    this._event = event;
  }

  get juror(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class JurorBalanceUnlocked extends ethereum.Event {
  get params(): JurorBalanceUnlocked__Params {
    return new JurorBalanceUnlocked__Params(this);
  }
}

export class JurorBalanceUnlocked__Params {
  _event: JurorBalanceUnlocked;

  constructor(event: JurorBalanceUnlocked) {
    this._event = event;
  }

  get juror(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class JurorSlashed extends ethereum.Event {
  get params(): JurorSlashed__Params {
    return new JurorSlashed__Params(this);
  }
}

export class JurorSlashed__Params {
  _event: JurorSlashed;

  constructor(event: JurorSlashed) {
    this._event = event;
  }

  get juror(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get effectiveTermId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class JurorTokensAssigned extends ethereum.Event {
  get params(): JurorTokensAssigned__Params {
    return new JurorTokensAssigned__Params(this);
  }
}

export class JurorTokensAssigned__Params {
  _event: JurorTokensAssigned;

  constructor(event: JurorTokensAssigned) {
    this._event = event;
  }

  get juror(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class JurorTokensBurned extends ethereum.Event {
  get params(): JurorTokensBurned__Params {
    return new JurorTokensBurned__Params(this);
  }
}

export class JurorTokensBurned__Params {
  _event: JurorTokensBurned;

  constructor(event: JurorTokensBurned) {
    this._event = event;
  }

  get amount(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class JurorTokensCollected extends ethereum.Event {
  get params(): JurorTokensCollected__Params {
    return new JurorTokensCollected__Params(this);
  }
}

export class JurorTokensCollected__Params {
  _event: JurorTokensCollected;

  constructor(event: JurorTokensCollected) {
    this._event = event;
  }

  get juror(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get effectiveTermId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TotalActiveBalanceLimitChanged extends ethereum.Event {
  get params(): TotalActiveBalanceLimitChanged__Params {
    return new TotalActiveBalanceLimitChanged__Params(this);
  }
}

export class TotalActiveBalanceLimitChanged__Params {
  _event: TotalActiveBalanceLimitChanged;

  constructor(event: TotalActiveBalanceLimitChanged) {
    this._event = event;
  }

  get previousTotalActiveBalanceLimit(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get currentTotalActiveBalanceLimit(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class Staked extends ethereum.Event {
  get params(): Staked__Params {
    return new Staked__Params(this);
  }
}

export class Staked__Params {
  _event: Staked;

  constructor(event: Staked) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get total(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }
}

export class Unstaked extends ethereum.Event {
  get params(): Unstaked__Params {
    return new Unstaked__Params(this);
  }
}

export class Unstaked__Params {
  _event: Unstaked;

  constructor(event: Unstaked) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get total(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }
}

export class RecoverFunds extends ethereum.Event {
  get params(): RecoverFunds__Params {
    return new RecoverFunds__Params(this);
  }
}

export class RecoverFunds__Params {
  _event: RecoverFunds;

  constructor(event: RecoverFunds) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get recipient(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get balance(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class JurorsRegistry__draftResult {
  value0: Array<Address>;
  value1: BigInt;

  constructor(value0: Array<Address>, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddressArray(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }
}

export class JurorsRegistry__balanceOfResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt, value3: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    return map;
  }
}

export class JurorsRegistry__balanceOfAtResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt, value3: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    return map;
  }
}

export class JurorsRegistry__getDeactivationRequestResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }
}

export class JurorsRegistry extends ethereum.SmartContract {
  static bind(address: Address): JurorsRegistry {
    return new JurorsRegistry("JurorsRegistry", address);
  }

  getController(): Address {
    let result = super.call("getController", "getController():(address)", []);

    return result[0].toAddress();
  }

  try_getController(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getController",
      "getController():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  draft(_params: Array<BigInt>): JurorsRegistry__draftResult {
    let result = super.call("draft", "draft(uint256[7]):(address[],uint256)", [
      ethereum.Value.fromUnsignedBigIntArray(_params)
    ]);

    return new JurorsRegistry__draftResult(
      result[0].toAddressArray(),
      result[1].toBigInt()
    );
  }

  try_draft(
    _params: Array<BigInt>
  ): ethereum.CallResult<JurorsRegistry__draftResult> {
    let result = super.tryCall(
      "draft",
      "draft(uint256[7]):(address[],uint256)",
      [ethereum.Value.fromUnsignedBigIntArray(_params)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new JurorsRegistry__draftResult(
        value[0].toAddressArray(),
        value[1].toBigInt()
      )
    );
  }

  slashOrUnlock(
    _termId: BigInt,
    _jurors: Array<Address>,
    _lockedAmounts: Array<BigInt>,
    _rewardedJurors: Array<boolean>
  ): BigInt {
    let result = super.call(
      "slashOrUnlock",
      "slashOrUnlock(uint64,address[],uint256[],bool[]):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_termId),
        ethereum.Value.fromAddressArray(_jurors),
        ethereum.Value.fromUnsignedBigIntArray(_lockedAmounts),
        ethereum.Value.fromBooleanArray(_rewardedJurors)
      ]
    );

    return result[0].toBigInt();
  }

  try_slashOrUnlock(
    _termId: BigInt,
    _jurors: Array<Address>,
    _lockedAmounts: Array<BigInt>,
    _rewardedJurors: Array<boolean>
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "slashOrUnlock",
      "slashOrUnlock(uint64,address[],uint256[],bool[]):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_termId),
        ethereum.Value.fromAddressArray(_jurors),
        ethereum.Value.fromUnsignedBigIntArray(_lockedAmounts),
        ethereum.Value.fromBooleanArray(_rewardedJurors)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  collectTokens(_juror: Address, _amount: BigInt, _termId: BigInt): boolean {
    let result = super.call(
      "collectTokens",
      "collectTokens(address,uint256,uint64):(bool)",
      [
        ethereum.Value.fromAddress(_juror),
        ethereum.Value.fromUnsignedBigInt(_amount),
        ethereum.Value.fromUnsignedBigInt(_termId)
      ]
    );

    return result[0].toBoolean();
  }

  try_collectTokens(
    _juror: Address,
    _amount: BigInt,
    _termId: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "collectTokens",
      "collectTokens(address,uint256,uint64):(bool)",
      [
        ethereum.Value.fromAddress(_juror),
        ethereum.Value.fromUnsignedBigInt(_amount),
        ethereum.Value.fromUnsignedBigInt(_termId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  token(): Address {
    let result = super.call("token", "token():(address)", []);

    return result[0].toAddress();
  }

  try_token(): ethereum.CallResult<Address> {
    let result = super.tryCall("token", "token():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  totalStaked(): BigInt {
    let result = super.call("totalStaked", "totalStaked():(uint256)", []);

    return result[0].toBigInt();
  }

  try_totalStaked(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("totalStaked", "totalStaked():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalActiveBalance(): BigInt {
    let result = super.call(
      "totalActiveBalance",
      "totalActiveBalance():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_totalActiveBalance(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalActiveBalance",
      "totalActiveBalance():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalActiveBalanceAt(_termId: BigInt): BigInt {
    let result = super.call(
      "totalActiveBalanceAt",
      "totalActiveBalanceAt(uint64):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_termId)]
    );

    return result[0].toBigInt();
  }

  try_totalActiveBalanceAt(_termId: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalActiveBalanceAt",
      "totalActiveBalanceAt(uint64):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_termId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalStakedFor(_juror: Address): BigInt {
    let result = super.call(
      "totalStakedFor",
      "totalStakedFor(address):(uint256)",
      [ethereum.Value.fromAddress(_juror)]
    );

    return result[0].toBigInt();
  }

  try_totalStakedFor(_juror: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalStakedFor",
      "totalStakedFor(address):(uint256)",
      [ethereum.Value.fromAddress(_juror)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  balanceOf(_juror: Address): JurorsRegistry__balanceOfResult {
    let result = super.call(
      "balanceOf",
      "balanceOf(address):(uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(_juror)]
    );

    return new JurorsRegistry__balanceOfResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt()
    );
  }

  try_balanceOf(
    _juror: Address
  ): ethereum.CallResult<JurorsRegistry__balanceOfResult> {
    let result = super.tryCall(
      "balanceOf",
      "balanceOf(address):(uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(_juror)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new JurorsRegistry__balanceOfResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt()
      )
    );
  }

  balanceOfAt(
    _juror: Address,
    _termId: BigInt
  ): JurorsRegistry__balanceOfAtResult {
    let result = super.call(
      "balanceOfAt",
      "balanceOfAt(address,uint64):(uint256,uint256,uint256,uint256)",
      [
        ethereum.Value.fromAddress(_juror),
        ethereum.Value.fromUnsignedBigInt(_termId)
      ]
    );

    return new JurorsRegistry__balanceOfAtResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt()
    );
  }

  try_balanceOfAt(
    _juror: Address,
    _termId: BigInt
  ): ethereum.CallResult<JurorsRegistry__balanceOfAtResult> {
    let result = super.tryCall(
      "balanceOfAt",
      "balanceOfAt(address,uint64):(uint256,uint256,uint256,uint256)",
      [
        ethereum.Value.fromAddress(_juror),
        ethereum.Value.fromUnsignedBigInt(_termId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new JurorsRegistry__balanceOfAtResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt()
      )
    );
  }

  activeBalanceOfAt(_juror: Address, _termId: BigInt): BigInt {
    let result = super.call(
      "activeBalanceOfAt",
      "activeBalanceOfAt(address,uint64):(uint256)",
      [
        ethereum.Value.fromAddress(_juror),
        ethereum.Value.fromUnsignedBigInt(_termId)
      ]
    );

    return result[0].toBigInt();
  }

  try_activeBalanceOfAt(
    _juror: Address,
    _termId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "activeBalanceOfAt",
      "activeBalanceOfAt(address,uint64):(uint256)",
      [
        ethereum.Value.fromAddress(_juror),
        ethereum.Value.fromUnsignedBigInt(_termId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  unlockedActiveBalanceOf(_juror: Address): BigInt {
    let result = super.call(
      "unlockedActiveBalanceOf",
      "unlockedActiveBalanceOf(address):(uint256)",
      [ethereum.Value.fromAddress(_juror)]
    );

    return result[0].toBigInt();
  }

  try_unlockedActiveBalanceOf(_juror: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "unlockedActiveBalanceOf",
      "unlockedActiveBalanceOf(address):(uint256)",
      [ethereum.Value.fromAddress(_juror)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getDeactivationRequest(
    _juror: Address
  ): JurorsRegistry__getDeactivationRequestResult {
    let result = super.call(
      "getDeactivationRequest",
      "getDeactivationRequest(address):(uint256,uint64)",
      [ethereum.Value.fromAddress(_juror)]
    );

    return new JurorsRegistry__getDeactivationRequestResult(
      result[0].toBigInt(),
      result[1].toBigInt()
    );
  }

  try_getDeactivationRequest(
    _juror: Address
  ): ethereum.CallResult<JurorsRegistry__getDeactivationRequestResult> {
    let result = super.tryCall(
      "getDeactivationRequest",
      "getDeactivationRequest(address):(uint256,uint64)",
      [ethereum.Value.fromAddress(_juror)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new JurorsRegistry__getDeactivationRequestResult(
        value[0].toBigInt(),
        value[1].toBigInt()
      )
    );
  }

  getWithdrawalsLockTermId(_juror: Address): BigInt {
    let result = super.call(
      "getWithdrawalsLockTermId",
      "getWithdrawalsLockTermId(address):(uint64)",
      [ethereum.Value.fromAddress(_juror)]
    );

    return result[0].toBigInt();
  }

  try_getWithdrawalsLockTermId(_juror: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getWithdrawalsLockTermId",
      "getWithdrawalsLockTermId(address):(uint64)",
      [ethereum.Value.fromAddress(_juror)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getJurorId(_juror: Address): BigInt {
    let result = super.call("getJurorId", "getJurorId(address):(uint256)", [
      ethereum.Value.fromAddress(_juror)
    ]);

    return result[0].toBigInt();
  }

  try_getJurorId(_juror: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getJurorId", "getJurorId(address):(uint256)", [
      ethereum.Value.fromAddress(_juror)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalJurorsActiveBalanceLimit(): BigInt {
    let result = super.call(
      "totalJurorsActiveBalanceLimit",
      "totalJurorsActiveBalanceLimit():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_totalJurorsActiveBalanceLimit(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalJurorsActiveBalanceLimit",
      "totalJurorsActiveBalanceLimit():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  supportsHistory(): boolean {
    let result = super.call("supportsHistory", "supportsHistory():(bool)", []);

    return result[0].toBoolean();
  }

  try_supportsHistory(): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsHistory",
      "supportsHistory():(bool)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class RecoverFundsCall extends ethereum.Call {
  get inputs(): RecoverFundsCall__Inputs {
    return new RecoverFundsCall__Inputs(this);
  }

  get outputs(): RecoverFundsCall__Outputs {
    return new RecoverFundsCall__Outputs(this);
  }
}

export class RecoverFundsCall__Inputs {
  _call: RecoverFundsCall;

  constructor(call: RecoverFundsCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RecoverFundsCall__Outputs {
  _call: RecoverFundsCall;

  constructor(call: RecoverFundsCall) {
    this._call = call;
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _controller(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _jurorToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _totalActiveBalanceLimit(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ActivateCall extends ethereum.Call {
  get inputs(): ActivateCall__Inputs {
    return new ActivateCall__Inputs(this);
  }

  get outputs(): ActivateCall__Outputs {
    return new ActivateCall__Outputs(this);
  }
}

export class ActivateCall__Inputs {
  _call: ActivateCall;

  constructor(call: ActivateCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ActivateCall__Outputs {
  _call: ActivateCall;

  constructor(call: ActivateCall) {
    this._call = call;
  }
}

export class DeactivateCall extends ethereum.Call {
  get inputs(): DeactivateCall__Inputs {
    return new DeactivateCall__Inputs(this);
  }

  get outputs(): DeactivateCall__Outputs {
    return new DeactivateCall__Outputs(this);
  }
}

export class DeactivateCall__Inputs {
  _call: DeactivateCall;

  constructor(call: DeactivateCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class DeactivateCall__Outputs {
  _call: DeactivateCall;

  constructor(call: DeactivateCall) {
    this._call = call;
  }
}

export class StakeCall extends ethereum.Call {
  get inputs(): StakeCall__Inputs {
    return new StakeCall__Inputs(this);
  }

  get outputs(): StakeCall__Outputs {
    return new StakeCall__Outputs(this);
  }
}

export class StakeCall__Inputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class StakeCall__Outputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }
}

export class StakeForCall extends ethereum.Call {
  get inputs(): StakeForCall__Inputs {
    return new StakeForCall__Inputs(this);
  }

  get outputs(): StakeForCall__Outputs {
    return new StakeForCall__Outputs(this);
  }
}

export class StakeForCall__Inputs {
  _call: StakeForCall;

  constructor(call: StakeForCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class StakeForCall__Outputs {
  _call: StakeForCall;

  constructor(call: StakeForCall) {
    this._call = call;
  }
}

export class UnstakeCall extends ethereum.Call {
  get inputs(): UnstakeCall__Inputs {
    return new UnstakeCall__Inputs(this);
  }

  get outputs(): UnstakeCall__Outputs {
    return new UnstakeCall__Outputs(this);
  }
}

export class UnstakeCall__Inputs {
  _call: UnstakeCall;

  constructor(call: UnstakeCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class UnstakeCall__Outputs {
  _call: UnstakeCall;

  constructor(call: UnstakeCall) {
    this._call = call;
  }
}

export class ReceiveApprovalCall extends ethereum.Call {
  get inputs(): ReceiveApprovalCall__Inputs {
    return new ReceiveApprovalCall__Inputs(this);
  }

  get outputs(): ReceiveApprovalCall__Outputs {
    return new ReceiveApprovalCall__Outputs(this);
  }
}

export class ReceiveApprovalCall__Inputs {
  _call: ReceiveApprovalCall;

  constructor(call: ReceiveApprovalCall) {
    this._call = call;
  }

  get _from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _token(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _data(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class ReceiveApprovalCall__Outputs {
  _call: ReceiveApprovalCall;

  constructor(call: ReceiveApprovalCall) {
    this._call = call;
  }
}

export class ProcessDeactivationRequestCall extends ethereum.Call {
  get inputs(): ProcessDeactivationRequestCall__Inputs {
    return new ProcessDeactivationRequestCall__Inputs(this);
  }

  get outputs(): ProcessDeactivationRequestCall__Outputs {
    return new ProcessDeactivationRequestCall__Outputs(this);
  }
}

export class ProcessDeactivationRequestCall__Inputs {
  _call: ProcessDeactivationRequestCall;

  constructor(call: ProcessDeactivationRequestCall) {
    this._call = call;
  }

  get _juror(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ProcessDeactivationRequestCall__Outputs {
  _call: ProcessDeactivationRequestCall;

  constructor(call: ProcessDeactivationRequestCall) {
    this._call = call;
  }
}

export class AssignTokensCall extends ethereum.Call {
  get inputs(): AssignTokensCall__Inputs {
    return new AssignTokensCall__Inputs(this);
  }

  get outputs(): AssignTokensCall__Outputs {
    return new AssignTokensCall__Outputs(this);
  }
}

export class AssignTokensCall__Inputs {
  _call: AssignTokensCall;

  constructor(call: AssignTokensCall) {
    this._call = call;
  }

  get _juror(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class AssignTokensCall__Outputs {
  _call: AssignTokensCall;

  constructor(call: AssignTokensCall) {
    this._call = call;
  }
}

export class BurnTokensCall extends ethereum.Call {
  get inputs(): BurnTokensCall__Inputs {
    return new BurnTokensCall__Inputs(this);
  }

  get outputs(): BurnTokensCall__Outputs {
    return new BurnTokensCall__Outputs(this);
  }
}

export class BurnTokensCall__Inputs {
  _call: BurnTokensCall;

  constructor(call: BurnTokensCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class BurnTokensCall__Outputs {
  _call: BurnTokensCall;

  constructor(call: BurnTokensCall) {
    this._call = call;
  }
}

export class DraftCall extends ethereum.Call {
  get inputs(): DraftCall__Inputs {
    return new DraftCall__Inputs(this);
  }

  get outputs(): DraftCall__Outputs {
    return new DraftCall__Outputs(this);
  }
}

export class DraftCall__Inputs {
  _call: DraftCall;

  constructor(call: DraftCall) {
    this._call = call;
  }

  get _params(): Array<BigInt> {
    return this._call.inputValues[0].value.toBigIntArray();
  }
}

export class DraftCall__Outputs {
  _call: DraftCall;

  constructor(call: DraftCall) {
    this._call = call;
  }

  get jurors(): Array<Address> {
    return this._call.outputValues[0].value.toAddressArray();
  }

  get length(): BigInt {
    return this._call.outputValues[1].value.toBigInt();
  }
}

export class SlashOrUnlockCall extends ethereum.Call {
  get inputs(): SlashOrUnlockCall__Inputs {
    return new SlashOrUnlockCall__Inputs(this);
  }

  get outputs(): SlashOrUnlockCall__Outputs {
    return new SlashOrUnlockCall__Outputs(this);
  }
}

export class SlashOrUnlockCall__Inputs {
  _call: SlashOrUnlockCall;

  constructor(call: SlashOrUnlockCall) {
    this._call = call;
  }

  get _termId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _jurors(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }

  get _lockedAmounts(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get _rewardedJurors(): Array<boolean> {
    return this._call.inputValues[3].value.toBooleanArray();
  }
}

export class SlashOrUnlockCall__Outputs {
  _call: SlashOrUnlockCall;

  constructor(call: SlashOrUnlockCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class CollectTokensCall extends ethereum.Call {
  get inputs(): CollectTokensCall__Inputs {
    return new CollectTokensCall__Inputs(this);
  }

  get outputs(): CollectTokensCall__Outputs {
    return new CollectTokensCall__Outputs(this);
  }
}

export class CollectTokensCall__Inputs {
  _call: CollectTokensCall;

  constructor(call: CollectTokensCall) {
    this._call = call;
  }

  get _juror(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _termId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class CollectTokensCall__Outputs {
  _call: CollectTokensCall;

  constructor(call: CollectTokensCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class LockWithdrawalsCall extends ethereum.Call {
  get inputs(): LockWithdrawalsCall__Inputs {
    return new LockWithdrawalsCall__Inputs(this);
  }

  get outputs(): LockWithdrawalsCall__Outputs {
    return new LockWithdrawalsCall__Outputs(this);
  }
}

export class LockWithdrawalsCall__Inputs {
  _call: LockWithdrawalsCall;

  constructor(call: LockWithdrawalsCall) {
    this._call = call;
  }

  get _juror(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _termId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class LockWithdrawalsCall__Outputs {
  _call: LockWithdrawalsCall;

  constructor(call: LockWithdrawalsCall) {
    this._call = call;
  }
}

export class SetTotalActiveBalanceLimitCall extends ethereum.Call {
  get inputs(): SetTotalActiveBalanceLimitCall__Inputs {
    return new SetTotalActiveBalanceLimitCall__Inputs(this);
  }

  get outputs(): SetTotalActiveBalanceLimitCall__Outputs {
    return new SetTotalActiveBalanceLimitCall__Outputs(this);
  }
}

export class SetTotalActiveBalanceLimitCall__Inputs {
  _call: SetTotalActiveBalanceLimitCall;

  constructor(call: SetTotalActiveBalanceLimitCall) {
    this._call = call;
  }

  get _totalActiveBalanceLimit(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetTotalActiveBalanceLimitCall__Outputs {
  _call: SetTotalActiveBalanceLimitCall;

  constructor(call: SetTotalActiveBalanceLimitCall) {
    this._call = call;
  }
}