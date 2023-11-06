// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class QuestMetadata extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save QuestMetadata entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type QuestMetadata must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("QuestMetadata", id.toString(), this);
    }
  }

  static loadInBlock(id: string): QuestMetadata | null {
    return changetype<QuestMetadata | null>(
      store.get_in_block("QuestMetadata", id)
    );
  }

  static load(id: string): QuestMetadata | null {
    return changetype<QuestMetadata | null>(store.get("QuestMetadata", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get questDescription(): string {
    let value = this.get("questDescription");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set questDescription(value: string) {
    this.set("questDescription", Value.fromString(value));
  }

  get questCommunicationLink(): string | null {
    let value = this.get("questCommunicationLink");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set questCommunicationLink(value: string | null) {
    if (!value) {
      this.unset("questCommunicationLink");
    } else {
      this.set("questCommunicationLink", Value.fromString(<string>value));
    }
  }
}

export class QuestEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save QuestEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type QuestEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("QuestEntity", id.toString(), this);
    }
  }

  static loadInBlock(id: string): QuestEntity | null {
    return changetype<QuestEntity | null>(
      store.get_in_block("QuestEntity", id)
    );
  }

  static load(id: string): QuestEntity | null {
    return changetype<QuestEntity | null>(store.get("QuestEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get version(): i32 {
    let value = this.get("version");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set version(value: i32) {
    this.set("version", Value.fromI32(value));
  }

  get questAddress(): string {
    let value = this.get("questAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set questAddress(value: string) {
    this.set("questAddress", Value.fromString(value));
  }

  get questTitle(): string {
    let value = this.get("questTitle");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set questTitle(value: string) {
    this.set("questTitle", Value.fromString(value));
  }

  get questMetadata(): string {
    let value = this.get("questMetadata");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set questMetadata(value: string) {
    this.set("questMetadata", Value.fromString(value));
  }

  get questExpireTimeSec(): BigInt | null {
    let value = this.get("questExpireTimeSec");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set questExpireTimeSec(value: BigInt | null) {
    if (!value) {
      this.unset("questExpireTimeSec");
    } else {
      this.set("questExpireTimeSec", Value.fromBigInt(<BigInt>value));
    }
  }

  get questRewardTokenAddress(): Bytes {
    let value = this.get("questRewardTokenAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set questRewardTokenAddress(value: Bytes) {
    this.set("questRewardTokenAddress", Value.fromBytes(value));
  }

  get creationTimestamp(): BigInt {
    let value = this.get("creationTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set creationTimestamp(value: BigInt) {
    this.set("creationTimestamp", Value.fromBigInt(value));
  }

  get questFundsRecoveryAddress(): Bytes {
    let value = this.get("questFundsRecoveryAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set questFundsRecoveryAddress(value: Bytes) {
    this.set("questFundsRecoveryAddress", Value.fromBytes(value));
  }

  get questCreator(): Bytes {
    let value = this.get("questCreator");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set questCreator(value: Bytes) {
    this.set("questCreator", Value.fromBytes(value));
  }

  get questMaxPlayers(): BigInt | null {
    let value = this.get("questMaxPlayers");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set questMaxPlayers(value: BigInt | null) {
    if (!value) {
      this.unset("questMaxPlayers");
    } else {
      this.set("questMaxPlayers", Value.fromBigInt(<BigInt>value));
    }
  }

  get questCreateDepositToken(): Bytes {
    let value = this.get("questCreateDepositToken");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set questCreateDepositToken(value: Bytes) {
    this.set("questCreateDepositToken", Value.fromBytes(value));
  }

  get questCreateDepositAmount(): BigInt {
    let value = this.get("questCreateDepositAmount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set questCreateDepositAmount(value: BigInt) {
    this.set("questCreateDepositAmount", Value.fromBigInt(value));
  }

  get questPlayDepositToken(): Bytes {
    let value = this.get("questPlayDepositToken");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set questPlayDepositToken(value: Bytes) {
    this.set("questPlayDepositToken", Value.fromBytes(value));
  }

  get questPlayDepositAmount(): BigInt {
    let value = this.get("questPlayDepositAmount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set questPlayDepositAmount(value: BigInt) {
    this.set("questPlayDepositAmount", Value.fromBigInt(value));
  }

  get questPlayers(): Array<string> {
    let value = this.get("questPlayers");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toStringArray();
    }
  }

  set questPlayers(value: Array<string>) {
    this.set("questPlayers", Value.fromStringArray(value));
  }

  get questIsWhiteListed(): boolean {
    let value = this.get("questIsWhiteListed");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set questIsWhiteListed(value: boolean) {
    this.set("questIsWhiteListed", Value.fromBoolean(value));
  }
}

export class CreateDepositEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save CreateDepositEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type CreateDepositEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("CreateDepositEntity", id.toString(), this);
    }
  }

  static loadInBlock(id: string): CreateDepositEntity | null {
    return changetype<CreateDepositEntity | null>(
      store.get_in_block("CreateDepositEntity", id)
    );
  }

  static load(id: string): CreateDepositEntity | null {
    return changetype<CreateDepositEntity | null>(
      store.get("CreateDepositEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get depositToken(): Bytes {
    let value = this.get("depositToken");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set depositToken(value: Bytes) {
    this.set("depositToken", Value.fromBytes(value));
  }

  get depositAmount(): BigInt {
    let value = this.get("depositAmount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set depositAmount(value: BigInt) {
    this.set("depositAmount", Value.fromBigInt(value));
  }
}

export class PlayDepositEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save PlayDepositEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type PlayDepositEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("PlayDepositEntity", id.toString(), this);
    }
  }

  static loadInBlock(id: string): PlayDepositEntity | null {
    return changetype<PlayDepositEntity | null>(
      store.get_in_block("PlayDepositEntity", id)
    );
  }

  static load(id: string): PlayDepositEntity | null {
    return changetype<PlayDepositEntity | null>(
      store.get("PlayDepositEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get depositToken(): Bytes {
    let value = this.get("depositToken");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set depositToken(value: Bytes) {
    this.set("depositToken", Value.fromBytes(value));
  }

  get depositAmount(): BigInt {
    let value = this.get("depositAmount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set depositAmount(value: BigInt) {
    this.set("depositAmount", Value.fromBigInt(value));
  }
}

export class QuestClaimEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save QuestClaimEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type QuestClaimEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("QuestClaimEntity", id.toString(), this);
    }
  }

  static loadInBlock(id: string): QuestClaimEntity | null {
    return changetype<QuestClaimEntity | null>(
      store.get_in_block("QuestClaimEntity", id)
    );
  }

  static load(id: string): QuestClaimEntity | null {
    return changetype<QuestClaimEntity | null>(
      store.get("QuestClaimEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get questAddress(): string {
    let value = this.get("questAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set questAddress(value: string) {
    this.set("questAddress", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get evidenceIpfsHash(): Bytes {
    let value = this.get("evidenceIpfsHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set evidenceIpfsHash(value: Bytes) {
    this.set("evidenceIpfsHash", Value.fromBytes(value));
  }

  get player(): string {
    let value = this.get("player");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set player(value: string) {
    this.set("player", Value.fromString(value));
  }
}
