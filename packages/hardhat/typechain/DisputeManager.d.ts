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
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface DisputeManagerInterface extends ethers.utils.Interface {
  functions: {
    "getDisputeFees()": FunctionFragment;
    "getDispute(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getDisputeFees",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDispute",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getDisputeFees",
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
