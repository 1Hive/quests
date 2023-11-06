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

interface QuestInterface extends ethers.utils.Interface {
  functions: {
    "aragonGovernAddress()": FunctionFragment;
    "canExecute(address)": FunctionFragment;
    "claim(bytes,address,uint256,bool)": FunctionFragment;
    "claims(uint256)": FunctionFragment;
    "createDeposit()": FunctionFragment;
    "expireTime()": FunctionFragment;
    "fundsRecoveryAddress()": FunctionFragment;
    "getPlayers()": FunctionFragment;
    "isCreateDepositReleased()": FunctionFragment;
    "isWhiteList()": FunctionFragment;
    "maxPlayers()": FunctionFragment;
    "play(address)": FunctionFragment;
    "playDeposit()": FunctionFragment;
    "questCreator()": FunctionFragment;
    "questDetailsRef()": FunctionFragment;
    "questTitle()": FunctionFragment;
    "recoverFundsAndDeposit()": FunctionFragment;
    "rewardToken()": FunctionFragment;
    "setWhiteList(address[])": FunctionFragment;
    "unplay(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "aragonGovernAddress",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "canExecute", values: [string]): string;
  encodeFunctionData(
    functionFragment: "claim",
    values: [BytesLike, string, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "claims",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "expireTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fundsRecoveryAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPlayers",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isCreateDepositReleased",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isWhiteList",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxPlayers",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "play", values: [string]): string;
  encodeFunctionData(
    functionFragment: "playDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "questCreator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "questDetailsRef",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "questTitle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "recoverFundsAndDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setWhiteList",
    values: [string[]]
  ): string;
  encodeFunctionData(functionFragment: "unplay", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "aragonGovernAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "canExecute", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claims", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "expireTime", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "fundsRecoveryAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPlayers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isCreateDepositReleased",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isWhiteList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "maxPlayers", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "play", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "playDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "questCreator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "questDetailsRef",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "questTitle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "recoverFundsAndDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setWhiteList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unplay", data: BytesLike): Result;

  events: {
    "QuestClaimed(bytes,address,uint256)": EventFragment;
    "QuestPlayed(address,uint256)": EventFragment;
    "QuestUnplayed(address,uint256)": EventFragment;
    "QuestWhiteListChanged(address[],uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "QuestClaimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "QuestPlayed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "QuestUnplayed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "QuestWhiteListChanged"): EventFragment;
}

export class Quest extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: QuestInterface;

  functions: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<[string]>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<[string]>;

    canExecute(executer: string, overrides?: CallOverrides): Promise<[boolean]>;

    "canExecute(address)"(
      executer: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    claim(
      _evidence: BytesLike,
      _player: string,
      _amount: BigNumberish,
      _claimAll: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "claim(bytes,address,uint256,bool)"(
      _evidence: BytesLike,
      _player: string,
      _amount: BigNumberish,
      _claimAll: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    claims(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber] & {
        evidence: string;
        player: string;
        amount: BigNumber;
      }
    >;

    "claims(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber] & {
        evidence: string;
        player: string;
        amount: BigNumber;
      }
    >;

    createDeposit(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    "createDeposit()"(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    expireTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    "expireTime()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    fundsRecoveryAddress(overrides?: CallOverrides): Promise<[string]>;

    "fundsRecoveryAddress()"(overrides?: CallOverrides): Promise<[string]>;

    getPlayers(overrides?: CallOverrides): Promise<[string[]]>;

    "getPlayers()"(overrides?: CallOverrides): Promise<[string[]]>;

    isCreateDepositReleased(overrides?: CallOverrides): Promise<[boolean]>;

    "isCreateDepositReleased()"(overrides?: CallOverrides): Promise<[boolean]>;

    isWhiteList(overrides?: CallOverrides): Promise<[boolean]>;

    "isWhiteList()"(overrides?: CallOverrides): Promise<[boolean]>;

    maxPlayers(overrides?: CallOverrides): Promise<[number]>;

    "maxPlayers()"(overrides?: CallOverrides): Promise<[number]>;

    play(_player: string, overrides?: Overrides): Promise<ContractTransaction>;

    "play(address)"(
      _player: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    playDeposit(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    "playDeposit()"(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    questCreator(overrides?: CallOverrides): Promise<[string]>;

    "questCreator()"(overrides?: CallOverrides): Promise<[string]>;

    questDetailsRef(overrides?: CallOverrides): Promise<[string]>;

    "questDetailsRef()"(overrides?: CallOverrides): Promise<[string]>;

    questTitle(overrides?: CallOverrides): Promise<[string]>;

    "questTitle()"(overrides?: CallOverrides): Promise<[string]>;

    recoverFundsAndDeposit(overrides?: Overrides): Promise<ContractTransaction>;

    "recoverFundsAndDeposit()"(
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<[string]>;

    "rewardToken()"(overrides?: CallOverrides): Promise<[string]>;

    setWhiteList(
      _players: string[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setWhiteList(address[])"(
      _players: string[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    unplay(
      _player: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "unplay(address)"(
      _player: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  aragonGovernAddress(overrides?: CallOverrides): Promise<string>;

  "aragonGovernAddress()"(overrides?: CallOverrides): Promise<string>;

  canExecute(executer: string, overrides?: CallOverrides): Promise<boolean>;

  "canExecute(address)"(
    executer: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  claim(
    _evidence: BytesLike,
    _player: string,
    _amount: BigNumberish,
    _claimAll: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "claim(bytes,address,uint256,bool)"(
    _evidence: BytesLike,
    _player: string,
    _amount: BigNumberish,
    _claimAll: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  claims(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber] & {
      evidence: string;
      player: string;
      amount: BigNumber;
    }
  >;

  "claims(uint256)"(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber] & {
      evidence: string;
      player: string;
      amount: BigNumber;
    }
  >;

  createDeposit(
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

  "createDeposit()"(
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

  expireTime(overrides?: CallOverrides): Promise<BigNumber>;

  "expireTime()"(overrides?: CallOverrides): Promise<BigNumber>;

  fundsRecoveryAddress(overrides?: CallOverrides): Promise<string>;

  "fundsRecoveryAddress()"(overrides?: CallOverrides): Promise<string>;

  getPlayers(overrides?: CallOverrides): Promise<string[]>;

  "getPlayers()"(overrides?: CallOverrides): Promise<string[]>;

  isCreateDepositReleased(overrides?: CallOverrides): Promise<boolean>;

  "isCreateDepositReleased()"(overrides?: CallOverrides): Promise<boolean>;

  isWhiteList(overrides?: CallOverrides): Promise<boolean>;

  "isWhiteList()"(overrides?: CallOverrides): Promise<boolean>;

  maxPlayers(overrides?: CallOverrides): Promise<number>;

  "maxPlayers()"(overrides?: CallOverrides): Promise<number>;

  play(_player: string, overrides?: Overrides): Promise<ContractTransaction>;

  "play(address)"(
    _player: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  playDeposit(
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

  "playDeposit()"(
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

  questCreator(overrides?: CallOverrides): Promise<string>;

  "questCreator()"(overrides?: CallOverrides): Promise<string>;

  questDetailsRef(overrides?: CallOverrides): Promise<string>;

  "questDetailsRef()"(overrides?: CallOverrides): Promise<string>;

  questTitle(overrides?: CallOverrides): Promise<string>;

  "questTitle()"(overrides?: CallOverrides): Promise<string>;

  recoverFundsAndDeposit(overrides?: Overrides): Promise<ContractTransaction>;

  "recoverFundsAndDeposit()"(
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  rewardToken(overrides?: CallOverrides): Promise<string>;

  "rewardToken()"(overrides?: CallOverrides): Promise<string>;

  setWhiteList(
    _players: string[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setWhiteList(address[])"(
    _players: string[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  unplay(_player: string, overrides?: Overrides): Promise<ContractTransaction>;

  "unplay(address)"(
    _player: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<string>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<string>;

    canExecute(executer: string, overrides?: CallOverrides): Promise<boolean>;

    "canExecute(address)"(
      executer: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    claim(
      _evidence: BytesLike,
      _player: string,
      _amount: BigNumberish,
      _claimAll: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    "claim(bytes,address,uint256,bool)"(
      _evidence: BytesLike,
      _player: string,
      _amount: BigNumberish,
      _claimAll: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    claims(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber] & {
        evidence: string;
        player: string;
        amount: BigNumber;
      }
    >;

    "claims(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber] & {
        evidence: string;
        player: string;
        amount: BigNumber;
      }
    >;

    createDeposit(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    "createDeposit()"(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    expireTime(overrides?: CallOverrides): Promise<BigNumber>;

    "expireTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    fundsRecoveryAddress(overrides?: CallOverrides): Promise<string>;

    "fundsRecoveryAddress()"(overrides?: CallOverrides): Promise<string>;

    getPlayers(overrides?: CallOverrides): Promise<string[]>;

    "getPlayers()"(overrides?: CallOverrides): Promise<string[]>;

    isCreateDepositReleased(overrides?: CallOverrides): Promise<boolean>;

    "isCreateDepositReleased()"(overrides?: CallOverrides): Promise<boolean>;

    isWhiteList(overrides?: CallOverrides): Promise<boolean>;

    "isWhiteList()"(overrides?: CallOverrides): Promise<boolean>;

    maxPlayers(overrides?: CallOverrides): Promise<number>;

    "maxPlayers()"(overrides?: CallOverrides): Promise<number>;

    play(_player: string, overrides?: CallOverrides): Promise<void>;

    "play(address)"(_player: string, overrides?: CallOverrides): Promise<void>;

    playDeposit(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    "playDeposit()"(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { token: string; amount: BigNumber }>;

    questCreator(overrides?: CallOverrides): Promise<string>;

    "questCreator()"(overrides?: CallOverrides): Promise<string>;

    questDetailsRef(overrides?: CallOverrides): Promise<string>;

    "questDetailsRef()"(overrides?: CallOverrides): Promise<string>;

    questTitle(overrides?: CallOverrides): Promise<string>;

    "questTitle()"(overrides?: CallOverrides): Promise<string>;

    recoverFundsAndDeposit(overrides?: CallOverrides): Promise<void>;

    "recoverFundsAndDeposit()"(overrides?: CallOverrides): Promise<void>;

    rewardToken(overrides?: CallOverrides): Promise<string>;

    "rewardToken()"(overrides?: CallOverrides): Promise<string>;

    setWhiteList(_players: string[], overrides?: CallOverrides): Promise<void>;

    "setWhiteList(address[])"(
      _players: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    unplay(_player: string, overrides?: CallOverrides): Promise<void>;

    "unplay(address)"(
      _player: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    QuestClaimed(evidence: null, player: null, amount: null): EventFilter;

    QuestPlayed(player: null, timestamp: null): EventFilter;

    QuestUnplayed(player: null, timestamp: null): EventFilter;

    QuestWhiteListChanged(whiteListPlayers: null, timestamp: null): EventFilter;
  };

  estimateGas: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<BigNumber>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<BigNumber>;

    canExecute(executer: string, overrides?: CallOverrides): Promise<BigNumber>;

    "canExecute(address)"(
      executer: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claim(
      _evidence: BytesLike,
      _player: string,
      _amount: BigNumberish,
      _claimAll: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "claim(bytes,address,uint256,bool)"(
      _evidence: BytesLike,
      _player: string,
      _amount: BigNumberish,
      _claimAll: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    claims(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "claims(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    "createDeposit()"(overrides?: CallOverrides): Promise<BigNumber>;

    expireTime(overrides?: CallOverrides): Promise<BigNumber>;

    "expireTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    fundsRecoveryAddress(overrides?: CallOverrides): Promise<BigNumber>;

    "fundsRecoveryAddress()"(overrides?: CallOverrides): Promise<BigNumber>;

    getPlayers(overrides?: CallOverrides): Promise<BigNumber>;

    "getPlayers()"(overrides?: CallOverrides): Promise<BigNumber>;

    isCreateDepositReleased(overrides?: CallOverrides): Promise<BigNumber>;

    "isCreateDepositReleased()"(overrides?: CallOverrides): Promise<BigNumber>;

    isWhiteList(overrides?: CallOverrides): Promise<BigNumber>;

    "isWhiteList()"(overrides?: CallOverrides): Promise<BigNumber>;

    maxPlayers(overrides?: CallOverrides): Promise<BigNumber>;

    "maxPlayers()"(overrides?: CallOverrides): Promise<BigNumber>;

    play(_player: string, overrides?: Overrides): Promise<BigNumber>;

    "play(address)"(_player: string, overrides?: Overrides): Promise<BigNumber>;

    playDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    "playDeposit()"(overrides?: CallOverrides): Promise<BigNumber>;

    questCreator(overrides?: CallOverrides): Promise<BigNumber>;

    "questCreator()"(overrides?: CallOverrides): Promise<BigNumber>;

    questDetailsRef(overrides?: CallOverrides): Promise<BigNumber>;

    "questDetailsRef()"(overrides?: CallOverrides): Promise<BigNumber>;

    questTitle(overrides?: CallOverrides): Promise<BigNumber>;

    "questTitle()"(overrides?: CallOverrides): Promise<BigNumber>;

    recoverFundsAndDeposit(overrides?: Overrides): Promise<BigNumber>;

    "recoverFundsAndDeposit()"(overrides?: Overrides): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    setWhiteList(_players: string[], overrides?: Overrides): Promise<BigNumber>;

    "setWhiteList(address[])"(
      _players: string[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    unplay(_player: string, overrides?: Overrides): Promise<BigNumber>;

    "unplay(address)"(
      _player: string,
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

    canExecute(
      executer: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "canExecute(address)"(
      executer: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claim(
      _evidence: BytesLike,
      _player: string,
      _amount: BigNumberish,
      _claimAll: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "claim(bytes,address,uint256,bool)"(
      _evidence: BytesLike,
      _player: string,
      _amount: BigNumberish,
      _claimAll: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    claims(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "claims(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createDeposit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "createDeposit()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    expireTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "expireTime()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fundsRecoveryAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "fundsRecoveryAddress()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPlayers(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getPlayers()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isCreateDepositReleased(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isCreateDepositReleased()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isWhiteList(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "isWhiteList()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxPlayers(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "maxPlayers()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    play(_player: string, overrides?: Overrides): Promise<PopulatedTransaction>;

    "play(address)"(
      _player: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    playDeposit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "playDeposit()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    questCreator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "questCreator()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    questDetailsRef(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "questDetailsRef()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    questTitle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "questTitle()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    recoverFundsAndDeposit(
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "recoverFundsAndDeposit()"(
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "rewardToken()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setWhiteList(
      _players: string[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setWhiteList(address[])"(
      _players: string[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    unplay(
      _player: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "unplay(address)"(
      _player: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
