/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import {
  Contract,
  ContractFactory,
  PayableOverrides,
} from "@ethersproject/contracts";

import type { TokenMock } from "../TokenMock";

export class TokenMock__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name: string,
    symbol: string,
    overrides?: PayableOverrides
  ): Promise<TokenMock> {
    return super.deploy(name, symbol, overrides || {}) as Promise<TokenMock>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: PayableOverrides
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  attach(address: string): TokenMock {
    return super.attach(address) as TokenMock;
  }
  connect(signer: Signer): TokenMock__factory {
    return super.connect(signer) as TokenMock__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenMock {
    return new Contract(address, _abi, signerOrProvider) as TokenMock;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "initialBalance",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405260405162000ec738038062000ec78339810160408190526200002691620001b9565b8151829082906200003f90600390602085019062000060565b5080516200005590600490602084019062000060565b505050505062000273565b8280546200006e9062000220565b90600052602060002090601f016020900481019282620000925760008555620000dd565b82601f10620000ad57805160ff1916838001178555620000dd565b82800160010185558215620000dd579182015b82811115620000dd578251825591602001919060010190620000c0565b50620000eb929150620000ef565b5090565b5b80821115620000eb5760008155600101620000f0565b600082601f83011262000117578081fd5b81516001600160401b03808211156200013457620001346200025d565b604051601f8301601f19908116603f011681019082821181831017156200015f576200015f6200025d565b816040528381526020925086838588010111156200017b578485fd5b8491505b838210156200019e57858201830151818301840152908201906200017f565b83821115620001af57848385830101525b9695505050505050565b60008060408385031215620001cc578182fd5b82516001600160401b0380821115620001e3578384fd5b620001f18683870162000106565b9350602085015191508082111562000207578283fd5b50620002168582860162000106565b9150509250929050565b6002810460018216806200023557607f821691505b602082108114156200025757634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b610c4480620002836000396000f3fe608060405234801561001057600080fd5b50600436106100d45760003560e01c806340c10f1911610081578063a457c2d71161005b578063a457c2d714610191578063a9059cbb146101a4578063dd62ed3e146101b7576100d4565b806340c10f191461016157806370a082311461017657806395d89b4114610189576100d4565b806323b872dd116100b257806323b872dd1461012c578063313ce5671461013f578063395093511461014e576100d4565b806306fdde03146100d9578063095ea7b3146100f757806318160ddd1461011a575b600080fd5b6100e16101fd565b6040516100ee9190610b0c565b60405180910390f35b61010a610105366004610ae3565b61028f565b60405190151581526020016100ee565b6002545b6040519081526020016100ee565b61010a61013a366004610aa8565b6102a7565b604051601281526020016100ee565b61010a61015c366004610ae3565b6102cb565b61017461016f366004610ae3565b610317565b005b61011e610184366004610a55565b610325565b6100e1610351565b61010a61019f366004610ae3565b610360565b61010a6101b2366004610ae3565b610436565b61011e6101c5366004610a76565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b60606003805461020c90610bba565b80601f016020809104026020016040519081016040528092919081815260200182805461023890610bba565b80156102855780601f1061025a57610100808354040283529160200191610285565b820191906000526020600020905b81548152906001019060200180831161026857829003601f168201915b5050505050905090565b60003361029d818585610444565b5060019392505050565b6000336102b58582856105f7565b6102c08585856106ce565b506001949350505050565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919061029d9082908690610312908790610b7d565b610444565b610321828261093d565b5050565b73ffffffffffffffffffffffffffffffffffffffff81166000908152602081905260409020545b919050565b60606004805461020c90610bba565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919083811015610429576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6102c08286868403610444565b60003361029d8185856106ce565b73ffffffffffffffffffffffffffffffffffffffff83166104e6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401610420565b73ffffffffffffffffffffffffffffffffffffffff8216610589576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152608401610420565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152600160209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146106c857818110156106bb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610420565b6106c88484848403610444565b50505050565b73ffffffffffffffffffffffffffffffffffffffff8316610771576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610420565b73ffffffffffffffffffffffffffffffffffffffff8216610814576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152608401610420565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260208190526040902054818110156108ca576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401610420565b73ffffffffffffffffffffffffffffffffffffffff848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a36106c8565b73ffffffffffffffffffffffffffffffffffffffff82166109ba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610420565b80600260008282546109cc9190610b7d565b909155505073ffffffffffffffffffffffffffffffffffffffff8216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610321565b803573ffffffffffffffffffffffffffffffffffffffff8116811461034c57600080fd5b600060208284031215610a66578081fd5b610a6f82610a31565b9392505050565b60008060408385031215610a88578081fd5b610a9183610a31565b9150610a9f60208401610a31565b90509250929050565b600080600060608486031215610abc578081fd5b610ac584610a31565b9250610ad360208501610a31565b9150604084013590509250925092565b60008060408385031215610af5578182fd5b610afe83610a31565b946020939093013593505050565b6000602080835283518082850152825b81811015610b3857858101830151858201604001528201610b1c565b81811115610b495783604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b60008219821115610bb5577f4e487b710000000000000000000000000000000000000000000000000000000081526011600452602481fd5b500190565b600281046001821680610bce57607f821691505b60208210811415610c08577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b5091905056fea26469706673582212205736dd923321a5d60220ed8346a2be0440f03acac5b3578fe15792cf63d5d11d64736f6c63430008020033";
