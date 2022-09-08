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

interface DisputeManagerInterface extends ethers.utils.Interface {
  functions: {
    "getDisputeFees()": FunctionFragment;
    "computeRuling(uint256)": FunctionFragment;
    "getDispute(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getDisputeFees",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "computeRuling",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDispute",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getDisputeFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeRuling",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getDispute", data: BytesLike): Result;

  events: {};
}

export class DisputeManager extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: DisputeManagerInterface;

  functions: {
    getDisputeFees(overrides?: CallOverrides): Promise<[string, BigNumber]>;

    "getDisputeFees()"(overrides?: CallOverrides): Promise<[string, BigNumber]>;

    computeRuling(
      _disputeId: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "computeRuling(uint256)"(
      _disputeId: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    getDispute(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, number, number, number, BigNumber, BigNumber] & {
        subject: string;
        possibleRulings: number;
        state: number;
        finalRuling: number;
        lastRoundId: BigNumber;
        createTermId: BigNumber;
      }
    >;

    "getDispute(uint256)"(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, number, number, number, BigNumber, BigNumber] & {
        subject: string;
        possibleRulings: number;
        state: number;
        finalRuling: number;
        lastRoundId: BigNumber;
        createTermId: BigNumber;
      }
    >;
  };

  getDisputeFees(overrides?: CallOverrides): Promise<[string, BigNumber]>;

  "getDisputeFees()"(overrides?: CallOverrides): Promise<[string, BigNumber]>;

  computeRuling(
    _disputeId: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "computeRuling(uint256)"(
    _disputeId: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  getDispute(
    _disputeId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, number, number, number, BigNumber, BigNumber] & {
      subject: string;
      possibleRulings: number;
      state: number;
      finalRuling: number;
      lastRoundId: BigNumber;
      createTermId: BigNumber;
    }
  >;

  "getDispute(uint256)"(
    _disputeId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, number, number, number, BigNumber, BigNumber] & {
      subject: string;
      possibleRulings: number;
      state: number;
      finalRuling: number;
      lastRoundId: BigNumber;
      createTermId: BigNumber;
    }
  >;

  callStatic: {
    getDisputeFees(overrides?: CallOverrides): Promise<[string, BigNumber]>;

    "getDisputeFees()"(overrides?: CallOverrides): Promise<[string, BigNumber]>;

    computeRuling(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, number] & { subject: string; finalRuling: number }>;

    "computeRuling(uint256)"(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, number] & { subject: string; finalRuling: number }>;

    getDispute(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, number, number, number, BigNumber, BigNumber] & {
        subject: string;
        possibleRulings: number;
        state: number;
        finalRuling: number;
        lastRoundId: BigNumber;
        createTermId: BigNumber;
      }
    >;

    "getDispute(uint256)"(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, number, number, number, BigNumber, BigNumber] & {
        subject: string;
        possibleRulings: number;
        state: number;
        finalRuling: number;
        lastRoundId: BigNumber;
        createTermId: BigNumber;
      }
    >;
  };

  filters: {};

  estimateGas: {
    getDisputeFees(overrides?: CallOverrides): Promise<BigNumber>;

    "getDisputeFees()"(overrides?: CallOverrides): Promise<BigNumber>;

    computeRuling(
      _disputeId: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "computeRuling(uint256)"(
      _disputeId: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    getDispute(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getDispute(uint256)"(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getDisputeFees(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getDisputeFees()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    computeRuling(
      _disputeId: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "computeRuling(uint256)"(
      _disputeId: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    getDispute(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getDispute(uint256)"(
      _disputeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
