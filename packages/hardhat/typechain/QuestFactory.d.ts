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
    "createQuest(bytes,address,uint256,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "aragonGovernAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createQuest",
    values: [BytesLike, string, BigNumberish, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "aragonGovernAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createQuest",
    data: BytesLike
  ): Result;

  events: {
    "QuestCreated(address,bytes)": EventFragment;
  };

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

    createQuest(
      _requirements: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "createQuest(bytes,address,uint256,address)"(
      _requirements: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  aragonGovernAddress(overrides?: CallOverrides): Promise<string>;

  "aragonGovernAddress()"(overrides?: CallOverrides): Promise<string>;

  createQuest(
    _requirements: BytesLike,
    _rewardToken: string,
    _expireTime: BigNumberish,
    _fundsRecoveryAddress: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "createQuest(bytes,address,uint256,address)"(
    _requirements: BytesLike,
    _rewardToken: string,
    _expireTime: BigNumberish,
    _fundsRecoveryAddress: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<string>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<string>;

    createQuest(
      _requirements: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "createQuest(bytes,address,uint256,address)"(
      _requirements: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    QuestCreated(questAddress: null, _requirements: null): EventFilter;
  };

  estimateGas: {
    aragonGovernAddress(overrides?: CallOverrides): Promise<BigNumber>;

    "aragonGovernAddress()"(overrides?: CallOverrides): Promise<BigNumber>;

    createQuest(
      _requirements: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "createQuest(bytes,address,uint256,address)"(
      _requirements: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
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

    createQuest(
      _requirements: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "createQuest(bytes,address,uint256,address)"(
      _requirements: BytesLike,
      _rewardToken: string,
      _expireTime: BigNumberish,
      _fundsRecoveryAddress: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}