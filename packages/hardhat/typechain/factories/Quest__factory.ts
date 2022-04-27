/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BytesLike, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Quest } from "../Quest";

export class Quest__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _questTitle: string,
    _questDetailsRef: BytesLike,
    _rewardToken: string,
    _expireTime: BigNumberish,
    _aragonGovernAddress: string,
    _fundsRecoveryAddress: string,
    _depositToken: string,
    _depositAmount: BigNumberish,
    overrides?: Overrides
  ): Promise<Quest> {
    return super.deploy(
      _questTitle,
      _questDetailsRef,
      _rewardToken,
      _expireTime,
      _aragonGovernAddress,
      _fundsRecoveryAddress,
      _depositToken,
      _depositAmount,
      overrides || {}
    ) as Promise<Quest>;
  }
  getDeployTransaction(
    _questTitle: string,
    _questDetailsRef: BytesLike,
    _rewardToken: string,
    _expireTime: BigNumberish,
    _aragonGovernAddress: string,
    _fundsRecoveryAddress: string,
    _depositToken: string,
    _depositAmount: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      _questTitle,
      _questDetailsRef,
      _rewardToken,
      _expireTime,
      _aragonGovernAddress,
      _fundsRecoveryAddress,
      _depositToken,
      _depositAmount,
      overrides || {}
    );
  }
  attach(address: string): Quest {
    return super.attach(address) as Quest;
  }
  connect(signer: Signer): Quest__factory {
    return super.connect(signer) as Quest__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Quest {
    return new Contract(address, _abi, signerOrProvider) as Quest;
  }
}

const _abi = [
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
        internalType: "address",
        name: "_aragonGovernAddress",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_fundsRecoveryAddress",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_depositToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_depositAmount",
        type: "uint256",
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
        internalType: "bytes",
        name: "evidence",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "QuestClaimed",
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
    inputs: [
      {
        internalType: "bytes",
        name: "_evidence",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_claimAll",
        type: "bool",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "claims",
    outputs: [
      {
        internalType: "bytes",
        name: "evidence",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "player",
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
    name: "expireTime",
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
    name: "fundsRecoveryAddress",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "questCreator",
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
    name: "questDetailsRef",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "questTitle",
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
    name: "recoverUnclaimedFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620019333803806200193383398101604081905262000034916200055b565b8751620000499060019060208b0190620003dd565b5086516200005f9060029060208a0190620003dd565b50600380546001600160a01b038089166001600160a01b031992831617909255600487905560058054878416908316179055600680548684169083161790556000805482163317908190556040805180820182528685168082526020918201879052600880549095161793849055600986905581518083019092529284168152808301859052620000fe9390929116906200071d6200010c821b17901c565b505050505050505062000800565b6020820151156200019a57815160208084015162000143916001600160a01b038416918591309190620007c66200019e821b17901c565b816001600160a01b031683600001516001600160a01b03167fec36c0364d931187a76cf66d7eee08fad0ec2e8b7458a8d8b26b36769d4d13f3856020015160405162000190919062000775565b60405180910390a3505b5050565b620001fb846323b872dd60e01b858585604051602401620001c29392919062000655565b60408051808303601f190181529190526020810180516001600160e01b0319939093166001600160e01b03938416179052906200020116565b50505050565b60006200025d826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316620002ab60201b6200086f179092919060201c565b805190915015620002a657808060200190518101906200027e919062000539565b620002a65760405162461bcd60e51b81526004016200029d906200072b565b60405180910390fd5b505050565b6060620002bc8484600085620002c6565b90505b9392505050565b606082471015620002eb5760405162461bcd60e51b81526004016200029d90620006ae565b620002f68562000395565b620003155760405162461bcd60e51b81526004016200029d90620006f4565b600080866001600160a01b0316858760405162000333919062000637565b60006040518083038185875af1925050503d806000811462000372576040519150601f19603f3d011682016040523d82523d6000602084013e62000377565b606091505b5090925090506200038a8282866200039f565b979650505050505050565b803b15155b919050565b60608315620003b0575081620002bf565b825115620003c15782518084602001fd5b8160405162461bcd60e51b81526004016200029d919062000679565b828054620003eb90620007ad565b90600052602060002090601f0160209004810192826200040f57600085556200045a565b82601f106200042a57805160ff19168380011785556200045a565b828001600101855582156200045a579182015b828111156200045a5782518255916020019190600101906200043d565b50620004689291506200046c565b5090565b5b808211156200046857600081556001016200046d565b60006001600160401b0380841115620004a057620004a0620007ea565b604051601f8501601f19908116603f01168101908282118183101715620004cb57620004cb620007ea565b81604052809350858152868686011115620004e557600080fd5b620004f58660208301876200077e565b5050509392505050565b80516001600160a01b03811681146200039a57600080fd5b600082601f83011262000528578081fd5b620002bf8383516020850162000483565b6000602082840312156200054b578081fd5b81518015158114620002bf578182fd5b600080600080600080600080610100898b03121562000578578384fd5b88516001600160401b03808211156200058f578586fd5b818b0191508b601f830112620005a3578586fd5b620005b48c83516020850162000483565b995060208b0151915080821115620005ca578586fd5b50620005d98b828c0162000517565b975050620005ea60408a01620004ff565b9550606089015194506200060160808a01620004ff565b93506200061160a08a01620004ff565b92506200062160c08a01620004ff565b915060e089015190509295985092959890939650565b600082516200064b8184602087016200077e565b9190910192915050565b6001600160a01b039384168152919092166020820152604081019190915260600190565b60006020825282518060208401526200069a8160408501602087016200077e565b601f01601f19169190910160400192915050565b60208082526026908201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6040820152651c8818d85b1b60d21b606082015260800190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6040820152691bdd081cdd58d8d9595960b21b606082015260800190565b90815260200190565b60005b838110156200079b57818101518382015260200162000781565b83811115620001fb5750506000910152565b600281046001821680620007c257607f821691505b60208210811415620007e457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b61112380620008106000396000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c8063b0a87ac111610076578063e0c234231161005b578063e0c2342314610145578063f294cf381461015a578063f7c618c114610162576100be565b8063b0a87ac11461012a578063b434151c14610132576100be565b80636c3a4cce116100a75780636c3a4cce146100eb5780637ceae31014610100578063a888c2cd14610108576100be565b8063310a1ee3146100c35780634621d082146100e1575b600080fd5b6100cb61016a565b6040516100d89190611024565b60405180910390f35b6100e9610170565b005b6100f36102c1565b6040516100d89190610dc8565b6100f36102dd565b61011b610116366004610d32565b6102f9565b6040516100d893929190610e53565b6100f36103d2565b6100e9610140366004610c3d565b6103ee565b61014d610666565b6040516100d89190610e40565b61014d6106f4565b6100f3610701565b60045481565b60045442116101b4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ab90610eeb565b60405180910390fd5b6000546040805180820190915260085473ffffffffffffffffffffffffffffffffffffffff908116825260095460208301526101f09216610888565b6006546003546040517f70a082310000000000000000000000000000000000000000000000000000000081526102bf9273ffffffffffffffffffffffffffffffffffffffff9081169216906370a082319061024f903090600401610dc8565b60206040518083038186803b15801561026757600080fd5b505afa15801561027b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061029f9190610d4a565b60035473ffffffffffffffffffffffffffffffffffffffff169190610921565b565b60005473ffffffffffffffffffffffffffffffffffffffff1681565b60065473ffffffffffffffffffffffffffffffffffffffff1681565b6007818154811061030957600080fd5b906000526020600020906003020160009150905080600001805461032c90611059565b80601f016020809104026020016040519081016040528092919081815260200182805461035890611059565b80156103a55780601f1061037a576101008083540402835291602001916103a5565b820191906000526020600020905b81548152906001019060200180831161038857829003601f168201915b505050506001830154600290930154919273ffffffffffffffffffffffffffffffffffffffff1691905083565b60055473ffffffffffffffffffffffffffffffffffffffff1681565b60055473ffffffffffffffffffffffffffffffffffffffff16331461043f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ab90610f22565b8351610477576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ab90610f90565b8015610526576003546040517f70a0823100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff909116906370a08231906104d3903090600401610dc8565b60206040518083038186803b1580156104eb57600080fd5b505afa1580156104ff573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105239190610d4a565b91505b8115610550576003546105509073ffffffffffffffffffffffffffffffffffffffff168484610921565b6040805160608101825285815273ffffffffffffffffffffffffffffffffffffffff85166020808301919091529181018490526007805460018101825560009190915281518051929360039092027fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68801926105ce9284920190610b59565b5060208201516001820180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff909216919091179055604091820151600290910155517fa1c3b325aa2c115e4b244062eba2515bc5585ae5b41556be8fef399ae9fde11b9061065890869086908690610e53565b60405180910390a150505050565b6002805461067390611059565b80601f016020809104026020016040519081016040528092919081815260200182805461069f90611059565b80156106ec5780601f106106c1576101008083540402835291602001916106ec565b820191906000526020600020905b8154815290600101906020018083116106cf57829003601f168201915b505050505081565b6001805461067390611059565b60035473ffffffffffffffffffffffffffffffffffffffff1681565b6020820151156107c257815160208301516107539073ffffffffffffffffffffffffffffffffffffffff831690849030906107c6565b8173ffffffffffffffffffffffffffffffffffffffff16836000015173ffffffffffffffffffffffffffffffffffffffff167fec36c0364d931187a76cf66d7eee08fad0ec2e8b7458a8d8b26b36769d4d13f385602001516040516107b89190611024565b60405180910390a3505b5050565b610869846323b872dd60e01b8585856040516024016107e793929190610de9565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152610945565b50505050565b606061087e84846000856109fb565b90505b9392505050565b6020820151156107c257815160208301516108bc9073ffffffffffffffffffffffffffffffffffffffff8316908490610921565b8173ffffffffffffffffffffffffffffffffffffffff16836000015173ffffffffffffffffffffffffffffffffffffffff167fc1c90b8e0705b212262c0dbd7580efe1862c2f185bf96899226f7596beb2db0985602001516040516107b89190611024565b6109408363a9059cbb60e01b84846040516024016107e7929190610e1a565b505050565b60006109a7826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff1661086f9092919063ffffffff16565b80519091501561094057808060200190518101906109c59190610c21565b610940576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ab90610fc7565b606082471015610a37576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ab90610e8e565b610a4085610afc565b610a76576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ab90610f59565b6000808673ffffffffffffffffffffffffffffffffffffffff168587604051610a9f9190610dac565b60006040518083038185875af1925050503d8060008114610adc576040519150601f19603f3d011682016040523d82523d6000602084013e610ae1565b606091505b5091509150610af1828286610b06565b979650505050505050565b803b15155b919050565b60608315610b15575081610881565b825115610b255782518084602001fd5b816040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ab9190610e40565b828054610b6590611059565b90600052602060002090601f016020900481019282610b875760008555610bcd565b82601f10610ba057805160ff1916838001178555610bcd565b82800160010185558215610bcd579182015b82811115610bcd578251825591602001919060010190610bb2565b50610bd9929150610bdd565b5090565b5b80821115610bd95760008155600101610bde565b803573ffffffffffffffffffffffffffffffffffffffff81168114610b0157600080fd5b8035610b01816110dc565b600060208284031215610c32578081fd5b8151610881816110dc565b60008060008060808587031215610c52578283fd5b843567ffffffffffffffff80821115610c69578485fd5b818701915087601f830112610c7c578485fd5b813581811115610c8e57610c8e6110ad565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908382118183101715610cd457610cd46110ad565b816040528281528a6020848701011115610cec578788fd5b8260208601602083013787602084830101528098505050505050610d1260208601610bf2565b925060408501359150610d2760608601610c16565b905092959194509250565b600060208284031215610d43578081fd5b5035919050565b600060208284031215610d5b578081fd5b5051919050565b60008151808452610d7a81602086016020860161102d565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60008251610dbe81846020870161102d565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b73ffffffffffffffffffffffffffffffffffffffff9384168152919092166020820152604081019190915260600190565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b6000602082526108816020830184610d62565b600060608252610e666060830186610d62565b73ffffffffffffffffffffffffffffffffffffffff9490941660208301525060400152919050565b60208082526026908201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60408201527f722063616c6c0000000000000000000000000000000000000000000000000000606082015260800190565b60208082526012908201527f4552524f523a204e6f7420657870697265640000000000000000000000000000604082015260600190565b60208082526018908201527f4552524f523a2053656e646572206e6f7420676f7665726e0000000000000000604082015260600190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b60208082526012908201527f4552524f523a204e6f2065766964656e63650000000000000000000000000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60408201527f6f74207375636365656400000000000000000000000000000000000000000000606082015260800190565b90815260200190565b60005b83811015611048578181015183820152602001611030565b838111156108695750506000910152565b60028104600182168061106d57607f821691505b602082108114156110a7577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b80151581146110ea57600080fd5b5056fea264697066735822122084a986c2073ae7b2a0bc168bc78ea5f2c1eb7db4c39c1fa2288ca039380ae48a64736f6c63430008010033";
