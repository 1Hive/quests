/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface QuestFactoryInterface extends ethers.utils.Interface {
  functions: {
    "aragonGovernAddress()": FunctionFragment;
    "createDeposit()": FunctionFragment;
    "createQuest(string,bytes,address,uint256,address,uint32,bool)": FunctionFragment;
    "owner()": FunctionFragment;
    "playDeposit()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setAragonGovernAddress(address)": FunctionFragment;
    "setCreateDeposit(address,uint256)": FunctionFragment;
    "setPlayDeposit(address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "aragonGovernAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createQuest",
    values: [
      string,
      BytesLike,
      string,
      BigNumberish,
      string,
      BigNumberish,
      boolean
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "playDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAragonGovernAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setCreateDeposit",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPlayDeposit",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "aragonGovernAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createQuest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "playDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAragonGovernAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCreateDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPlayDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "CreateDepositChanged(uint256,address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "PlayDepositChanged(uint256,address,uint256)": EventFragment;
    "QuestCreated(address,string,bytes,address,uint256,address,address,uint256,address,uint256,address,uint32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CreateDepositChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PlayDepositChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "QuestCreated"): EventFragment;
}

export class QuestFactory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: QuestFactoryInterface;

  functions: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<[string]>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<[string]>;

    createDeposit(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    "createDeposit()"(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    createQuest(
      _questTitle: string,
      _questDetailsRef: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      _maxPlayers: BigNumberish,
      _isWhiteList: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "createQuest(string,bytes,address,uint256,address,uint32,bool)"(
      _questTitle: string,
      _questDetailsRef: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      _maxPlayers: BigNumberish,
      _isWhiteList: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    "owner()"(overrides?: CallOverrides): Promise<[string]>;

    playDeposit(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    "playDeposit()"(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    renounceOwnership(overrides?: Overrides): Promise<ContractTransaction>;

    "renounceOwnership()"(overrides?: Overrides): Promise<ContractTransaction>;

    setAragonGovernAddress(
      _aragonGovernAddress: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setAragonGovernAddress(address)"(
      _aragonGovernAddress: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setCreateDeposit(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setCreateDeposit(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setPlayDeposit(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setPlayDeposit(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  aragonGovernAddress(overrides?: CallOverrides): Promise<string>;

  "aragonGovernAddress()"(overrides?: CallOverrides): Promise<string>;

  createDeposit(
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

  "createDeposit()"(
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

  createQuest(
    _questTitle: string,
    _questDetailsRef: BytesLike,
    _rewardToken: string,
    _expireTime: BigNumberish,
    _fundsRecoveryAddress: string,
    _maxPlayers: BigNumberish,
    _isWhiteList: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "createQuest(string,bytes,address,uint256,address,uint32,bool)"(
    _questTitle: string,
    _questDetailsRef: BytesLike,
    _rewardToken: string,
    _expireTime: BigNumberish,
    _fundsRecoveryAddress: string,
    _maxPlayers: BigNumberish,
    _isWhiteList: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  playDeposit(
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

  "playDeposit()"(
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

  renounceOwnership(overrides?: Overrides): Promise<ContractTransaction>;

  "renounceOwnership()"(overrides?: Overrides): Promise<ContractTransaction>;

  setAragonGovernAddress(
    _aragonGovernAddress: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setAragonGovernAddress(address)"(
    _aragonGovernAddress: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setCreateDeposit(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setCreateDeposit(address,uint256)"(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setPlayDeposit(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setPlayDeposit(address,uint256)"(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "transferOwnership(address)"(
    newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<string>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<string>;

    createDeposit(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    "createDeposit()"(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    createQuest(
      _questTitle: string,
      _questDetailsRef: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      _maxPlayers: BigNumberish,
      _isWhiteList: boolean,
      overrides?: CallOverrides
    ): Promise<string>;

    "createQuest(string,bytes,address,uint256,address,uint32,bool)"(
      _questTitle: string,
      _questDetailsRef: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      _maxPlayers: BigNumberish,
      _isWhiteList: boolean,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    playDeposit(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    "playDeposit()"(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    "renounceOwnership()"(overrides?: CallOverrides): Promise<void>;

    setAragonGovernAddress(
      _aragonGovernAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "setAragonGovernAddress(address)"(
      _aragonGovernAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setCreateDeposit(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setCreateDeposit(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setPlayDeposit(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setPlayDeposit(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    CreateDepositChanged(
      timestamp: null,
      token: null,
      amount: null
    ): EventFilter;

    OwnershipTransferred(
      previousOwner: string | null,
      newOwner: string | null
    ): EventFilter;

    PlayDepositChanged(timestamp: null, token: null, amount: null): EventFilter;

    QuestCreated(
      questAddress: null,
      questTitle: null,
      questDetailsRef: null,
      rewardTokenAddress: null,
      expireTime: null,
      fundsRecoveryAddress: null,
      createDepositToken: null,
      createDepositAmount: null,
      playDepositToken: null,
      playDepositAmount: null,
      creator: null,
      maxPlayers: null
    ): EventFilter;
  };

  estimateGas: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<BigNumber>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<BigNumber>;

    createDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    "createDeposit()"(overrides?: CallOverrides): Promise<BigNumber>;

    createQuest(
      _questTitle: string,
      _questDetailsRef: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      _maxPlayers: BigNumberish,
      _isWhiteList: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "createQuest(string,bytes,address,uint256,address,uint32,bool)"(
      _questTitle: string,
      _questDetailsRef: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      _maxPlayers: BigNumberish,
      _isWhiteList: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    playDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    "playDeposit()"(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides): Promise<BigNumber>;

    "renounceOwnership()"(overrides?: Overrides): Promise<BigNumber>;

    setAragonGovernAddress(
      _aragonGovernAddress: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setAragonGovernAddress(address)"(
      _aragonGovernAddress: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setCreateDeposit(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setCreateDeposit(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setPlayDeposit(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setPlayDeposit(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    aragonGovernAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "aragonGovernAddress()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createDeposit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "createDeposit()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    createQuest(
      _questTitle: string,
      _questDetailsRef: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      _maxPlayers: BigNumberish,
      _isWhiteList: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "createQuest(string,bytes,address,uint256,address,uint32,bool)"(
      _questTitle: string,
      _questDetailsRef: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      _maxPlayers: BigNumberish,
      _isWhiteList: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    playDeposit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "playDeposit()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides): Promise<PopulatedTransaction>;

    "renounceOwnership()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    setAragonGovernAddress(
      _aragonGovernAddress: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setAragonGovernAddress(address)"(
      _aragonGovernAddress: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setCreateDeposit(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setCreateDeposit(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setPlayDeposit(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setPlayDeposit(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
