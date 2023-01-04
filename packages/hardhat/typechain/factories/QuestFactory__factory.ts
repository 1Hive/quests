/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { QuestFactory } from "../QuestFactory";

export class QuestFactory__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _aragonGovernAddress: string,
    _createDepositToken: string,
    _createDepositAmount: BigNumberish,
    _playDepositToken: string,
    _playDepositAmount: BigNumberish,
    _initialOwner: string,
    overrides?: Overrides
  ): Promise<QuestFactory> {
    return super.deploy(
      _aragonGovernAddress,
      _createDepositToken,
      _createDepositAmount,
      _playDepositToken,
      _playDepositAmount,
      _initialOwner,
      overrides || {}
    ) as Promise<QuestFactory>;
  }
  getDeployTransaction(
    _aragonGovernAddress: string,
    _createDepositToken: string,
    _createDepositAmount: BigNumberish,
    _playDepositToken: string,
    _playDepositAmount: BigNumberish,
    _initialOwner: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      _aragonGovernAddress,
      _createDepositToken,
      _createDepositAmount,
      _playDepositToken,
      _playDepositAmount,
      _initialOwner,
      overrides || {}
    );
  }
  attach(address: string): QuestFactory {
    return super.attach(address) as QuestFactory;
  }
  connect(signer: Signer): QuestFactory__factory {
    return super.connect(signer) as QuestFactory__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): QuestFactory {
    return new Contract(address, _abi, signerOrProvider) as QuestFactory;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_aragonGovernAddress",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_createDepositToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_createDepositAmount",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "_playDepositToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_playDepositAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_initialOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "CreateDepositChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PlayDepositChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "questAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "questTitle",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "questDetailsRef",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "address",
        name: "rewardTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "expireTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "fundsRecoveryAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "createDepositToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createDepositAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "playDepositToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "playDepositAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "maxPlayers",
        type: "uint32",
      },
    ],
    name: "QuestCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "aragonGovernAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "createDeposit",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_questTitle",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "_questDetailsRef",
        type: "bytes",
      },
      {
        internalType: "contract IERC20",
        name: "_rewardToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expireTime",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "_fundsRecoveryAddress",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_maxPlayers",
        type: "uint32",
      },
    ],
    name: "createQuest",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "playDeposit",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_aragonGovernAddress",
        type: "address",
      },
    ],
    name: "setAragonGovernAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "setCreateDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "setPlayDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200396b3803806200396b83398101604081905262000034916200028c565b6200004862000042620000a3565b620000a7565b600180546001600160a01b0319166001600160a01b0388161790556200006f8585620000f7565b6200007b838362000177565b6001600160a01b038116331462000097576200009781620001eb565b505050505050620003b7565b3390565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6200010162000235565b6040805180820182526001600160a01b0384168082526020909101839052600280546001600160a01b03191690911790556003829055517f35c5e8a6f8bed2c61a2eb1996d117b1b96192314c0d4ca7cd96360f250920079906200016b9042908590859062000382565b60405180910390a15050565b6200018162000235565b6040805180820182526001600160a01b0384168082526020909101839052600480546001600160a01b03191690911790556005829055517f013c800b1a136f9798a25e471501a7b824156d1e9cba8439821c5a41adf2fb89906200016b9042908590859062000382565b620001f562000235565b6001600160a01b038116620002275760405162461bcd60e51b81526004016200021e9062000307565b60405180910390fd5b6200023281620000a7565b50565b6200023f620000a3565b6001600160a01b0316620002526200027d565b6001600160a01b0316146200027b5760405162461bcd60e51b81526004016200021e906200034d565b565b6000546001600160a01b031690565b60008060008060008060c08789031215620002a5578182fd5b8651620002b281620003a1565b6020880151909650620002c581620003a1565b604088015160608901519196509450620002df81620003a1565b608088015160a08901519194509250620002f981620003a1565b809150509295509295509295565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201526564647265737360d01b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b9283526001600160a01b03919091166020830152604082015260600190565b6001600160a01b03811681146200023257600080fd5b6135a480620003c76000396000f3fe60806040523480156200001157600080fd5b5060043610620000cf5760003560e01c8063b0a87ac11162000081578063e87fae211162000063578063e87fae21146200015e578063edeecdd31462000175578063f2fde38b146200018c57620000cf565b8063b0a87ac1146200014a578063d03ffefb146200015457620000cf565b80638c43b41111620000b75780638c43b41114620000f75780638c53c9bd146200010e5780638da5cb5b146200013157620000cf565b8062732e3014620000d4578063715018a614620000ed575b600080fd5b620000eb620000e536600462000c39565b620001a3565b005b620000eb620001f4565b620000eb6200010836600462000c7a565b6200020c565b62000118620002b1565b6040516200012892919062000f50565b60405180910390f35b6200013b620002d3565b60405162000128919062000e2d565b6200013b620002ef565b620001186200030b565b6200013b6200016f36600462000ca8565b6200032d565b620000eb6200018636600462000c7a565b620004be565b620000eb6200019d36600462000c39565b62000557565b620001ad620005c8565b600180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b620001fe620005c8565b6200020a600062000642565b565b62000216620005c8565b60408051808201825273ffffffffffffffffffffffffffffffffffffffff84168082526020909101839052600480547fffffffffffffffffffffffff00000000000000000000000000000000000000001690911790556005829055517f013c800b1a136f9798a25e471501a7b824156d1e9cba8439821c5a41adf2fb8990620002a590429085908590620011ec565b60405180910390a15050565b60045460055473ffffffffffffffffffffffffffffffffffffffff9091169082565b60005473ffffffffffffffffffffffffffffffffffffffff1690565b60015473ffffffffffffffffffffffffffffffffffffffff1681565b60025460035473ffffffffffffffffffffffffffffffffffffffff9091169082565b60015460408051808201825260025473ffffffffffffffffffffffffffffffffffffffff9081168252600354602080840191909152835180850185526004548316815260055491810191909152925160009485948c948c948c948c9491909116928b929133908c90620003a09062000b6e565b620003b59a9998979695949392919062000f8b565b604051809103906000f080158015620003d2573d6000803e3d6000fd5b506040805180820190915260025473ffffffffffffffffffffffffffffffffffffffff168152600354602082015290915062000410903383620006b7565b7f6b2fd076e791d7e0318fa62bf6e275ebe9ff601badea3d9bfdc43c02317d1119818989898989600260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260010154600460000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460010154338e604051620004ab9c9b9a9998979695949392919062000ea6565b60405180910390a1979650505050505050565b620004c8620005c8565b60408051808201825273ffffffffffffffffffffffffffffffffffffffff84168082526020909101839052600280547fffffffffffffffffffffffff00000000000000000000000000000000000000001690911790556003829055517f35c5e8a6f8bed2c61a2eb1996d117b1b96192314c0d4ca7cd96360f25092007990620002a590429085908590620011ec565b62000561620005c8565b73ffffffffffffffffffffffffffffffffffffffff8116620005ba576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005b19062001032565b60405180910390fd5b620005c58162000642565b50565b620005d2620006d4565b73ffffffffffffffffffffffffffffffffffffffff16620005f2620002d3565b73ffffffffffffffffffffffffffffffffffffffff16146200020a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005b190620010ec565b6000805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b620006c38383620006d8565b620006cf838262000807565b505050565b3390565b602082015115620008035781516040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815260009173ffffffffffffffffffffffffffffffffffffffff169063dd62ed3e906200073d908590309060040162000e4e565b60206040518083038186803b1580156200075657600080fd5b505afa1580156200076b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000791919062000d7b565b90508260200151811015620007d4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005b19062001121565b60208301518351620006cf9173ffffffffffffffffffffffffffffffffffffffff90911690849030906200083f565b5050565b602082015115620008035760208201518251620008039173ffffffffffffffffffffffffffffffffffffffff909116908390620008ec565b620008e6846323b872dd60e01b858585604051602401620008639392919062000e75565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909316929092179091526200090e565b50505050565b620006cf8363a9059cbb60e01b84846040516024016200086392919062000f50565b600062000972826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff16620009cc9092919063ffffffff16565b805190915015620006cf578080602001905181019062000993919062000c58565b620006cf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005b1906200118f565b6060620009dd8484600085620009e7565b90505b9392505050565b60608247101562000a26576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005b1906200108f565b62000a318562000af6565b62000a6a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005b19062001158565b6000808673ffffffffffffffffffffffffffffffffffffffff16858760405162000a95919062000e0f565b60006040518083038185875af1925050503d806000811462000ad4576040519150601f19603f3d011682016040523d82523d6000602084013e62000ad9565b606091505b509150915062000aeb82828662000b16565b979650505050505050565b73ffffffffffffffffffffffffffffffffffffffff81163b15155b919050565b6060831562000b27575081620009e0565b82511562000b385782518084602001fd5b816040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005b1919062000f76565b6122d5806200129a83390190565b600067ffffffffffffffff8084111562000b9a5762000b9a62001247565b604051601f85017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810190828211818310171562000be35762000be362001247565b8160405280935085815286868601111562000bfd57600080fd5b858560208301376000602087830101525050509392505050565b803562000b118162001276565b803563ffffffff8116811462000b1157600080fd5b60006020828403121562000c4b578081fd5b8135620009e08162001276565b60006020828403121562000c6a578081fd5b81518015158114620009e0578182fd5b6000806040838503121562000c8d578081fd5b823562000c9a8162001276565b946020939093013593505050565b60008060008060008060c0878903121562000cc1578182fd5b863567ffffffffffffffff8082111562000cd9578384fd5b818901915089601f83011262000ced578384fd5b62000cfe8a83356020850162000b7c565b9750602089013591508082111562000d14578384fd5b508701601f8101891362000d26578283fd5b62000d378982356020840162000b7c565b95505062000d486040880162000c17565b93506060870135925062000d5f6080880162000c17565b915062000d6f60a0880162000c24565b90509295509295509295565b60006020828403121562000d8d578081fd5b5051919050565b6000815180845262000dae81602086016020860162001218565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b805173ffffffffffffffffffffffffffffffffffffffff168252602090810151910152565b63ffffffff169052565b6000825162000e2381846020870162001218565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b73ffffffffffffffffffffffffffffffffffffffff92831681529116602082015260400190565b73ffffffffffffffffffffffffffffffffffffffff9384168152919092166020820152604081019190915260600190565b600073ffffffffffffffffffffffffffffffffffffffff808f168352610180602084015262000eda61018084018f62000d94565b838103604085015262000eee818f62000d94565b925050808c1660608401528a6080840152808a1660a084015280891660c08401528760e0840152808716610100840152856101208401528085166101408401525062000f3f61016083018462000e05565b9d9c50505050505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b600060208252620009e0602083018462000d94565b600061018080835262000fa18184018e62000d94565b9050828103602084015262000fb7818d62000d94565b91505073ffffffffffffffffffffffffffffffffffffffff808b166040840152896060840152808916608084015280881660a084015262000ffc60c084018862000de0565b6200100c61010084018762000de0565b8085166101408401525063ffffffff83166101608301529b9a5050505050505050505050565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201527f6464726573730000000000000000000000000000000000000000000000000000606082015260800190565b60208082526026908201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60408201527f722063616c6c0000000000000000000000000000000000000000000000000000606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6020808252601d908201527f4552524f52203a204465706f7369742062616420616c6c6f77616e6365000000604082015260600190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60408201527f6f74207375636365656400000000000000000000000000000000000000000000606082015260800190565b92835273ffffffffffffffffffffffffffffffffffffffff919091166020830152604082015260600190565b60005b83811015620012355781810151838201526020016200121b565b83811115620008e65750506000910152565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b73ffffffffffffffffffffffffffffffffffffffff81168114620005c557600080fdfe60806040523480156200001157600080fd5b50604051620022d5380380620022d58339810160408190526200003491620002b7565b8951620000499060019060208d019062000118565b5088516200005f9060029060208c019062000118565b50600380546001600160a01b03199081166001600160a01b039a8b16179091556004979097556005805488169689169690961790955560068054600080548916938a16939093179092558351600880548916918a169190911790556020938401516009558251600a80548916918a169190911790559190920151600b55600c805460ff19169055931693169290921763ffffffff60a01b1916600160a01b63ffffffff90931692909202919091179055506200044e9050565b8280546200012690620003e2565b90600052602060002090601f0160209004810192826200014a576000855562000195565b82601f106200016557805160ff191683800117855562000195565b8280016001018555821562000195579182015b828111156200019557825182559160200191906001019062000178565b50620001a3929150620001a7565b5090565b5b80821115620001a35760008155600101620001a8565b8051620001cb8162000435565b919050565b600082601f830112620001e1578081fd5b81516001600160401b03811115620001fd57620001fd6200041f565b602062000213601f8301601f19168201620003af565b828152858284870101111562000227578384fd5b835b838110156200024657858101830151828201840152820162000229565b838111156200025757848385840101525b5095945050505050565b60006040828403121562000273578081fd5b6200027f6040620003af565b905081516200028e8162000435565b808252506020820151602082015292915050565b805163ffffffff81168114620001cb57600080fd5b6000806000806000806000806000806101808b8d031215620002d7578586fd5b8a516001600160401b0380821115620002ee578788fd5b620002fc8e838f01620001d0565b9b5060208d015191508082111562000312578788fd5b50620003218d828e01620001d0565b9950506200033260408c01620001be565b975060608b015196506200034960808c01620001be565b95506200035960a08c01620001be565b94506200036a8c60c08d0162000261565b93506200037c8c6101008d0162000261565b92506200038d6101408c01620001be565b91506200039e6101608c01620002a2565b90509295989b9194979a5092959850565b604051601f8201601f191681016001600160401b0381118282101715620003da57620003da6200041f565b604052919050565b600281046001821680620003f757607f821691505b602082108114156200041957634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146200044b57600080fd5b50565b611e77806200045e6000396000f3fe608060405234801561001057600080fd5b50600436106101365760003560e01c80638c53c9bd116100b2578063d03ffefb11610081578063e492814f11610066578063e492814f14610255578063f294cf3814610268578063f7c618c11461027057610136565b8063d03ffefb14610238578063e0c234231461024057610136565b80638c53c9bd146101e5578063a888c2cd146101fb578063b0a87ac11461021d578063b434151c1461022557610136565b8063579ca2c9116101095780637ceae310116100ee5780637ceae310146101b557806385c99e2b146101bd5780638b5b9ccc146101d057610136565b8063579ca2c9146101985780636c3a4cce146101a057610136565b8063151dfb061461013b578063310a1ee31461015057806348d6cb531461016e5780634c2412a214610183575b600080fd5b61014e610149366004611638565b610278565b005b610158610553565b6040516101659190611cae565b60405180910390f35b610176610559565b60405161016591906118f2565b61018b610562565b6040516101659190611cb7565b61014e610586565b6101a861074f565b60405161016591906117f9565b6101a861076b565b6101766101cb366004611638565b610787565b6101d86107bd565b6040516101659190611898565b6101ed61082c565b604051610165929190611872565b61020e610209366004611763565b61084e565b60405161016593929190611910565b6101a8610927565b61014e61023336600461166e565b610943565b6101ed610cc0565b610248610ce2565b60405161016591906118fd565b61014e610263366004611638565b610d70565b610248610fe1565b6101a8610fee565b3373ffffffffffffffffffffffffffffffffffffffff821614806102b3575060005473ffffffffffffffffffffffffffffffffffffffff1633145b6102f2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611c51565b60405180910390fd5b60006102fd8261100a565b9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1415610359576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e9906119df565b600d805461036990600190611d05565b815481106103a0577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600091825260209091200154600d805473ffffffffffffffffffffffffffffffffffffffff9092169183908110610400577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600d805480610480577f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b600082815260209081902082017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90810180547fffffffffffffffffffffffff000000000000000000000000000000000000000016905590910190915560408051808201909152600a5473ffffffffffffffffffffffffffffffffffffffff168152600b549181019190915261051690836110d2565b7fc4a67a0877d477de99d765a3d9f48abfbe6181dff4727d68c3cb6071555541758242604051610547929190611872565b60405180910390a15050565b60045481565b600c5460ff1681565b60065474010000000000000000000000000000000000000000900463ffffffff1681565b6004544210156105c2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611a73565b600c5460ff16610634576000546040805180820190915260085473ffffffffffffffffffffffffffffffffffffffff9081168252600954602083015261060892166110d2565b600c80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790555b6003546040517f70a0823100000000000000000000000000000000000000000000000000000000815260009173ffffffffffffffffffffffffffffffffffffffff16906370a082319061068b9030906004016117f9565b60206040518083038186803b1580156106a357600080fd5b505afa1580156106b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106db919061177b565b600a5460035491925073ffffffffffffffffffffffffffffffffffffffff9182169116141561072257600d54600b5461071e9161071791611cc8565b829061110b565b9150505b60065460035461074c9173ffffffffffffffffffffffffffffffffffffffff918216911683611131565b50565b60005473ffffffffffffffffffffffffffffffffffffffff1681565b60065473ffffffffffffffffffffffffffffffffffffffff1681565b60006107928261100a565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff141590505b919050565b6060600d80548060200260200160405190810160405280929190818152602001828054801561082257602002820191906000526020600020905b815473ffffffffffffffffffffffffffffffffffffffff1681526001909101906020018083116107f7575b5050505050905090565b600a54600b5473ffffffffffffffffffffffffffffffffffffffff9091169082565b6007818154811061085e57600080fd5b906000526020600020906003020160009150905080600001805461088190611d48565b80601f01602080910402602001604051908101604052809291908181526020018280546108ad90611d48565b80156108fa5780601f106108cf576101008083540402835291602001916108fa565b820191906000526020600020905b8154815290600101906020018083116108dd57829003601f168201915b505050506001830154600290930154919273ffffffffffffffffffffffffffffffffffffffff1691905083565b60055473ffffffffffffffffffffffffffffffffffffffff1681565b60055473ffffffffffffffffffffffffffffffffffffffff163314610994576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611ae1565b83516109cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611b86565b6003546040517f70a0823100000000000000000000000000000000000000000000000000000000815260009173ffffffffffffffffffffffffffffffffffffffff16906370a0823190610a239030906004016117f9565b60206040518083038186803b158015610a3b57600080fd5b505afa158015610a4f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a73919061177b565b90508115610b095760085460035473ffffffffffffffffffffffffffffffffffffffff90811691161415610abc57600954600090610ab290839061110b565b9450610ac0915050565b8092505b600a5460035473ffffffffffffffffffffffffffffffffffffffff90811691161415610b0957600d54600b54600091610b0491610afd9190611cc8565b859061110b565b945050505b60085460035473ffffffffffffffffffffffffffffffffffffffff90811691161415610b7f576000610b3b828561110b565b915050600860010154811015610b7d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611982565b505b8215610ba957600354610ba99073ffffffffffffffffffffffffffffffffffffffff168585611131565b6040805160608101825286815273ffffffffffffffffffffffffffffffffffffffff86166020808301919091529181018590526007805460018101825560009190915281518051929360039092027fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c6880192610c279284920190611570565b5060208201516001820180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff909216919091179055604091820151600290910155517fa1c3b325aa2c115e4b244062eba2515bc5585ae5b41556be8fef399ae9fde11b90610cb190879087908790611910565b60405180910390a15050505050565b60085460095473ffffffffffffffffffffffffffffffffffffffff9091169082565b60028054610cef90611d48565b80601f0160208091040260200160405190810160405280929190818152602001828054610d1b90611d48565b8015610d685780601f10610d3d57610100808354040283529160200191610d68565b820191906000526020600020905b815481529060010190602001808311610d4b57829003601f168201915b505050505081565b3373ffffffffffffffffffffffffffffffffffffffff82161480610dab575060005473ffffffffffffffffffffffffffffffffffffffff1633145b610de1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611c51565b60065474010000000000000000000000000000000000000000900463ffffffff161580610e305750600654600d547401000000000000000000000000000000000000000090910463ffffffff16115b610e66576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611aaa565b6004544210610ea1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e99061194b565b6000610eac8261100a565b9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14610f07576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611bbd565b60408051808201909152600a5473ffffffffffffffffffffffffffffffffffffffff168152600b546020820152610f3f9033306111d7565b600d80546001810182556000919091527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb50180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff84161790556040517f35ec60f951b4abc8b287ab5148caf98524052482927d42e86a720cc71b8a76a1906105479084904290611872565b60018054610cef90611d48565b60035473ffffffffffffffffffffffffffffffffffffffff1681565b6000805b600d548110156110aa578273ffffffffffffffffffffffffffffffffffffffff16600d8281548110611069577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60009182526020909120015473ffffffffffffffffffffffffffffffffffffffff1614156110985790506107b8565b806110a281611d9c565b91505061100e565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff92915050565b60208201511561110757602082015182516111079173ffffffffffffffffffffffffffffffffffffffff909116908390611131565b5050565b600080838311156111215750600090508061112a565b50600190508183035b9250929050565b6111d28363a9059cbb60e01b8484604051602401611150929190611872565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909316929092179091526111eb565b505050565b6111e183836112a1565b6111d283826110d2565b600061124d826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff166113c09092919063ffffffff16565b8051909150156111d2578080602001905181019061126b9190611652565b6111d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611bf4565b6020820151156111075781516040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815260009173ffffffffffffffffffffffffffffffffffffffff169063dd62ed3e90611303908590309060040161181a565b60206040518083038186803b15801561131b57600080fd5b505afa15801561132f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611353919061177b565b90508260200151811015611393576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611b18565b602083015183516111d29173ffffffffffffffffffffffffffffffffffffffff90911690849030906113d9565b60606113cf8484600085611400565b90505b9392505050565b6113fa846323b872dd60e01b85858560405160240161115093929190611841565b50505050565b60608247101561143c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611a16565b61144585611501565b61147b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e990611b4f565b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040516114a491906117dd565b60006040518083038185875af1925050503d80600081146114e1576040519150601f19603f3d011682016040523d82523d6000602084013e6114e6565b606091505b50915091506114f682828661151d565b979650505050505050565b73ffffffffffffffffffffffffffffffffffffffff163b151590565b6060831561152c5750816113d2565b82511561153c5782518084602001fd5b816040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e991906118fd565b82805461157c90611d48565b90600052602060002090601f01602090048101928261159e57600085556115e4565b82601f106115b757805160ff19168380011785556115e4565b828001600101855582156115e4579182015b828111156115e45782518255916020019190600101906115c9565b506115f09291506115f4565b5090565b5b808211156115f057600081556001016115f5565b803573ffffffffffffffffffffffffffffffffffffffff811681146107b857600080fd5b80356107b881611e33565b600060208284031215611649578081fd5b6113d282611609565b600060208284031215611663578081fd5b81516113d281611e33565b60008060008060808587031215611683578283fd5b843567ffffffffffffffff8082111561169a578485fd5b818701915087601f8301126116ad578485fd5b8135818111156116bf576116bf611e04565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810190838211818310171561170557611705611e04565b816040528281528a602084870101111561171d578788fd5b826020860160208301378760208483010152809850505050505061174360208601611609565b9250604085013591506117586060860161162d565b905092959194509250565b600060208284031215611774578081fd5b5035919050565b60006020828403121561178c578081fd5b5051919050565b600081518084526117ab816020860160208601611d1c565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b600082516117ef818460208701611d1c565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b73ffffffffffffffffffffffffffffffffffffffff92831681529116602082015260400190565b73ffffffffffffffffffffffffffffffffffffffff9384168152919092166020820152604081019190915260600190565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b6020808252825182820181905260009190848201906040850190845b818110156118e657835173ffffffffffffffffffffffffffffffffffffffff16835292840192918401916001016118b4565b50909695505050505050565b901515815260200190565b6000602082526113d26020830184611793565b6000606082526119236060830186611793565b73ffffffffffffffffffffffffffffffffffffffff9490941660208301525060400152919050565b60208082526014908201527f4552524f523a2051756573742065787069726564000000000000000000000000604082015260600190565b60208082526027908201527f4552524f523a2053686f756c64206e6f742065786365656420616c6c6f77656460408201527f20626f756e747900000000000000000000000000000000000000000000000000606082015260800190565b60208082526019908201527f4552524f523a20706c61796572206e6f7420696e206c69737400000000000000604082015260600190565b60208082526026908201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60408201527f722063616c6c0000000000000000000000000000000000000000000000000000606082015260800190565b60208082526012908201527f4552524f523a204e6f7420657870697265640000000000000000000000000000604082015260600190565b6020808252601a908201527f4552524f523a204d617820706c61796572732072656163686564000000000000604082015260600190565b60208082526018908201527f4552524f523a2053656e646572206e6f7420676f7665726e0000000000000000604082015260600190565b6020808252601d908201527f4552524f52203a204465706f7369742062616420616c6c6f77616e6365000000604082015260600190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b60208082526012908201527f4552524f523a204e6f2065766964656e63650000000000000000000000000000604082015260600190565b6020808252601c908201527f4552524f523a20506c6179657220616c72656164792065786973747300000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60408201527f6f74207375636365656400000000000000000000000000000000000000000000606082015260800190565b60208082526024908201527f4552524f523a2053656e646572206e6f7420706c61796572206e6f722063726560408201527f61746f7200000000000000000000000000000000000000000000000000000000606082015260800190565b90815260200190565b63ffffffff91909116815260200190565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611d0057611d00611dd5565b500290565b600082821015611d1757611d17611dd5565b500390565b60005b83811015611d37578181015183820152602001611d1f565b838111156113fa5750506000910152565b600281046001821680611d5c57607f821691505b60208210811415611d96577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611dce57611dce611dd5565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b801515811461074c57600080fdfea2646970667358221220001ecc7e3a56a6e8ceba0a2f6f0020ef13bacde460faf1b1cca5699bfd12ab1764736f6c63430008010033a264697066735822122006ddcb5ccdb8532fd391ece411b1311d2d44d237eb8d1044c11f2c762c9eb08564736f6c63430008010033";
