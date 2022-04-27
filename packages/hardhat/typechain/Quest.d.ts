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
    "claim(bytes,address,uint256,bool)": FunctionFragment;
    "claims(uint256)": FunctionFragment;
    "expireTime()": FunctionFragment;
    "fundsRecoveryAddress()": FunctionFragment;
    "questCreator()": FunctionFragment;
    "questDetailsRef()": FunctionFragment;
    "questTitle()": FunctionFragment;
    "recoverUnclaimedFunds()": FunctionFragment;
    "rewardToken()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "aragonGovernAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claim",
    values: [BytesLike, string, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "claims",
    values: [BigNumberish]
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
    functionFragment: "recoverUnclaimedFunds",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "aragonGovernAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claims", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "expireTime", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "fundsRecoveryAddress",
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
    functionFragment: "recoverUnclaimedFunds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
    data: BytesLike
  ): Result;

  events: {
    "QuestClaimed(bytes,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "QuestClaimed"): EventFragment;
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

    expireTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    "expireTime()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    fundsRecoveryAddress(overrides?: CallOverrides): Promise<[string]>;

    "fundsRecoveryAddress()"(overrides?: CallOverrides): Promise<[string]>;

    questCreator(overrides?: CallOverrides): Promise<[string]>;

    "questCreator()"(overrides?: CallOverrides): Promise<[string]>;

    questDetailsRef(overrides?: CallOverrides): Promise<[string]>;

    "questDetailsRef()"(overrides?: CallOverrides): Promise<[string]>;

    questTitle(overrides?: CallOverrides): Promise<[string]>;

    "questTitle()"(overrides?: CallOverrides): Promise<[string]>;

    recoverUnclaimedFunds(overrides?: Overrides): Promise<ContractTransaction>;

    "recoverUnclaimedFunds()"(
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<[string]>;

    "rewardToken()"(overrides?: CallOverrides): Promise<[string]>;
  };

  aragonGovernAddress(overrides?: CallOverrides): Promise<string>;

  "aragonGovernAddress()"(overrides?: CallOverrides): Promise<string>;

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

  expireTime(overrides?: CallOverrides): Promise<BigNumber>;

  "expireTime()"(overrides?: CallOverrides): Promise<BigNumber>;

  fundsRecoveryAddress(overrides?: CallOverrides): Promise<string>;

  "fundsRecoveryAddress()"(overrides?: CallOverrides): Promise<string>;

  questCreator(overrides?: CallOverrides): Promise<string>;

  "questCreator()"(overrides?: CallOverrides): Promise<string>;

  questDetailsRef(overrides?: CallOverrides): Promise<string>;

  "questDetailsRef()"(overrides?: CallOverrides): Promise<string>;

  questTitle(overrides?: CallOverrides): Promise<string>;

  "questTitle()"(overrides?: CallOverrides): Promise<string>;

  recoverUnclaimedFunds(overrides?: Overrides): Promise<ContractTransaction>;

  "recoverUnclaimedFunds()"(
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  rewardToken(overrides?: CallOverrides): Promise<string>;

  "rewardToken()"(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<string>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<string>;

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

    expireTime(overrides?: CallOverrides): Promise<BigNumber>;

    "expireTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    fundsRecoveryAddress(overrides?: CallOverrides): Promise<string>;

    "fundsRecoveryAddress()"(overrides?: CallOverrides): Promise<string>;

    questCreator(overrides?: CallOverrides): Promise<string>;

    "questCreator()"(overrides?: CallOverrides): Promise<string>;

    questDetailsRef(overrides?: CallOverrides): Promise<string>;

    "questDetailsRef()"(overrides?: CallOverrides): Promise<string>;

    questTitle(overrides?: CallOverrides): Promise<string>;

    "questTitle()"(overrides?: CallOverrides): Promise<string>;

    recoverUnclaimedFunds(overrides?: CallOverrides): Promise<void>;

    "recoverUnclaimedFunds()"(overrides?: CallOverrides): Promise<void>;

    rewardToken(overrides?: CallOverrides): Promise<string>;

    "rewardToken()"(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    QuestClaimed(evidence: null, player: null, amount: null): EventFilter;
  };

  estimateGas: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<BigNumber>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<BigNumber>;

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

    expireTime(overrides?: CallOverrides): Promise<BigNumber>;

    "expireTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    fundsRecoveryAddress(overrides?: CallOverrides): Promise<BigNumber>;

    "fundsRecoveryAddress()"(overrides?: CallOverrides): Promise<BigNumber>;

    questCreator(overrides?: CallOverrides): Promise<BigNumber>;

    "questCreator()"(overrides?: CallOverrides): Promise<BigNumber>;

    questDetailsRef(overrides?: CallOverrides): Promise<BigNumber>;

    "questDetailsRef()"(overrides?: CallOverrides): Promise<BigNumber>;

    questTitle(overrides?: CallOverrides): Promise<BigNumber>;

    "questTitle()"(overrides?: CallOverrides): Promise<BigNumber>;

    recoverUnclaimedFunds(overrides?: Overrides): Promise<BigNumber>;

    "recoverUnclaimedFunds()"(overrides?: Overrides): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardToken()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    aragonGovernAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "aragonGovernAddress()"(
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

    expireTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "expireTime()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fundsRecoveryAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "fundsRecoveryAddress()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    questCreator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "questCreator()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    questDetailsRef(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "questDetailsRef()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    questTitle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "questTitle()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    recoverUnclaimedFunds(overrides?: Overrides): Promise<PopulatedTransaction>;

    "recoverUnclaimedFunds()"(
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "rewardToken()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
