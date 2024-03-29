/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Models } from "../Models";

export class Models__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Models> {
    return super.deploy(overrides || {}) as Promise<Models>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Models {
    return super.attach(address) as Models;
  }
  connect(signer: Signer): Models__factory {
    return super.connect(signer) as Models__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Models {
    return new Contract(address, _abi, signerOrProvider) as Models;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "c__0xa9dfceef",
        type: "bytes32",
      },
    ],
    name: "c_0xa9dfceef",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60e0610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063b8b153ba146038575b600080fd5b604e6004803603810190604a91906066565b6050565b005b50565b6000813590506060816096565b92915050565b600060208284031215607757600080fd5b60006083848285016053565b91505092915050565b6000819050919050565b609d81608c565b811460a757600080fd5b5056fea26469706673582212207c4ab43236faaa19caf7c418568056772ad922fb8ab65826357969db54c19b4364736f6c63430008010033";
