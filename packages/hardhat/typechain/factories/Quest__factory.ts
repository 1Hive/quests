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
    _createDeposit: { token: string; amount: BigNumberish },
    _playDeposit: { token: string; amount: BigNumberish },
    _questParam: {
      questCreator: string;
      maxPlayers: BigNumberish;
      rewardToken: string;
      expireTime: BigNumberish;
      aragonGovernAddress: string;
      fundsRecoveryAddress: string;
      isWhiteList: boolean;
    },
    overrides?: Overrides
  ): Promise<Quest> {
    return super.deploy(
      _questTitle,
      _questDetailsRef,
      _createDeposit,
      _playDeposit,
      _questParam,
      overrides || {}
    ) as Promise<Quest>;
  }
  getDeployTransaction(
    _questTitle: string,
    _questDetailsRef: BytesLike,
    _createDeposit: { token: string; amount: BigNumberish },
    _playDeposit: { token: string; amount: BigNumberish },
    _questParam: {
      questCreator: string;
      maxPlayers: BigNumberish;
      rewardToken: string;
      expireTime: BigNumberish;
      aragonGovernAddress: string;
      fundsRecoveryAddress: string;
      isWhiteList: boolean;
    },
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      _questTitle,
      _questDetailsRef,
      _createDeposit,
      _playDeposit,
      _questParam,
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
        components: [
          {
            internalType: "contract IERC20Upgradeable",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Models.Deposit",
        name: "_createDeposit",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "contract IERC20Upgradeable",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Models.Deposit",
        name: "_playDeposit",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "questCreator",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "maxPlayers",
            type: "uint32",
          },
          {
            internalType: "contract IERC20Upgradeable",
            name: "rewardToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expireTime",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "aragonGovernAddress",
            type: "address",
          },
          {
            internalType: "address payable",
            name: "fundsRecoveryAddress",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isWhiteList",
            type: "bool",
          },
        ],
        internalType: "struct Models.QuestParam",
        name: "_questParam",
        type: "tuple",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "QuestPlayed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "QuestUnplayed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "whiteListPlayers",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "QuestWhiteListChanged",
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
        internalType: "address",
        name: "executer",
        type: "address",
      },
    ],
    name: "canExecute",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
    name: "createDeposit",
    outputs: [
      {
        internalType: "contract IERC20Upgradeable",
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
    name: "getPlayers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isCreateDepositReleased",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isWhiteList",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxPlayers",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
    ],
    name: "play",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "playDeposit",
    outputs: [
      {
        internalType: "contract IERC20Upgradeable",
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
    name: "recoverFundsAndDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [
      {
        internalType: "contract IERC20Upgradeable",
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
        internalType: "address[]",
        name: "_players",
        type: "address[]",
      },
    ],
    name: "setWhiteList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
    ],
    name: "unplay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002a2e38038062002a2e833981016040819052620000349162000423565b8060c0015180156200005057506000816020015163ffffffff16115b15620000e35760405162461bcd60e51b815260206004820152605260248201527f4552524f523a2043616e27742063726561746520612077686974654c6973746560448201527f642071756573742077697468206d617820706c61796572732067726561746572606482015271207468616e20302028696e66696e6974792960701b608482015260a40160405180910390fd5b8451620000f8906001906020880190620001f1565b5083516200010e906002906020870190620001f1565b506040810151600380546001600160a01b03199081166001600160a01b03938416179091556060830151600455608083015160058054831691841691909117905560a083015160068054855160008054861691871691909117905587516008805486169187169190911790556020978801516009558651600a8054861691871691909117905595870151600b55600c805460ff191690559584015160c0909401519490911691161763ffffffff60a01b1916600160a01b63ffffffff909216919091021760ff60c01b1916600160c01b9115159190910217905550620005909050565b828054620001ff9062000524565b90600052602060002090601f0160209004810192826200022357600085556200026e565b82601f106200023e57805160ff19168380011785556200026e565b828001600101855582156200026e579182015b828111156200026e57825182559160200191906001019062000251565b506200027c92915062000280565b5090565b5b808211156200027c576000815560010162000281565b60006001600160401b03831115620002b357620002b362000561565b6020620002c9601f8501601f19168201620004f1565b9150838252848484011115620002de57600080fd5b60005b84811015620002fc57838101518382018301528101620002e1565b848111156200030e5760008286850101525b50509392505050565b8051620003248162000577565b919050565b805180151581146200032457600080fd5b6000604082840312156200034c578081fd5b620003586040620004f1565b90508151620003678162000577565b808252506020820151602082015292915050565b600060e082840312156200038d578081fd5b6200039960e0620004f1565b90508151620003a88162000577565b8152602082015163ffffffff81168114620003c257600080fd5b6020820152620003d56040830162000317565b604082015260608201516060820152620003f26080830162000317565b60808201526200040560a0830162000317565b60a08201526200041860c0830162000329565b60c082015292915050565b60008060008060006101a086880312156200043c578081fd5b85516001600160401b038082111562000453578283fd5b818801915088601f83011262000467578283fd5b620004788983516020850162000297565b965060208801519150808211156200048e578283fd5b508601601f81018813620004a0578182fd5b620004b18882516020840162000297565b945050620004c387604088016200033a565b9250620004d487608088016200033a565b9150620004e58760c088016200037b565b90509295509295909350565b604051601f8201601f191681016001600160401b03811182821017156200051c576200051c62000561565b604052919050565b6002810460018216806200053957607f821691505b602082108114156200055b57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146200058d57600080fd5b50565b61248e80620005a06000396000f3fe608060405234801561001057600080fd5b506004361061016c5760003560e01c80638b5b9ccc116100cd578063d03ffefb11610081578063e492814f11610066578063e492814f146103ab578063f294cf38146103be578063f7c618c1146103c65761016c565b8063d03ffefb14610372578063e0c23423146103965761016c565b8063a888c2cd116100b2578063a888c2cd1461031d578063b0a87ac11461033f578063b434151c1461035f5761016c565b80638b5b9ccc146102b85780638c53c9bd146102cd5761016c565b8063579ca2c911610124578063775b9c1311610109578063775b9c13146102725780637ceae3101461028557806385c99e2b146102a55761016c565b8063579ca2c9146102255780636c3a4cce1461022d5761016c565b8063310a1ee311610155578063310a1ee3146101c457806348d6cb53146101db5780634c2412a2146101e85761016c565b8063151dfb06146101715780632f17b18214610186575b600080fd5b61018461017f366004611f3f565b6103e6565b005b6006546101af907801000000000000000000000000000000000000000000000000900460ff1681565b60405190151581526020015b60405180910390f35b6101cd60045481565b6040519081526020016101bb565b600c546101af9060ff1681565b6006546102109074010000000000000000000000000000000000000000900463ffffffff1681565b60405163ffffffff90911681526020016101bb565b610184610807565b60005461024d9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101bb565b610184610280366004611f60565b6109fb565b60065461024d9073ffffffffffffffffffffffffffffffffffffffff1681565b6101af6102b3366004611f3f565b610cc8565b6102c0610cfe565b6040516101bb91906121e9565b600a54600b546102f19173ffffffffffffffffffffffffffffffffffffffff169082565b6040805173ffffffffffffffffffffffffffffffffffffffff90931683526020830191909152016101bb565b61033061032b366004612103565b610d6d565b6040516101bb93929190612231565b60055461024d9073ffffffffffffffffffffffffffffffffffffffff1681565b61018461036d36600461202a565b610e46565b6008546009546102f19173ffffffffffffffffffffffffffffffffffffffff169082565b61039e611274565b6040516101bb919061221e565b6101846103b9366004611f3f565b611302565b61039e61170d565b60035461024d9073ffffffffffffffffffffffffffffffffffffffff1681565b6006547801000000000000000000000000000000000000000000000000900460ff161561049a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f4552524f523a2063616e277420756e706c617920612077686974656c6973746560448201527f642071756573740000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff821614806104d5575060005473ffffffffffffffffffffffffffffffffffffffff1633145b610560576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f4552524f523a2053656e646572206e6f7420706c61796572206e6f722063726560448201527f61746f72000000000000000000000000000000000000000000000000000000006064820152608401610491565b600061056b8261171a565b9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14156105f7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4552524f523a20706c61796572206e6f7420696e206c697374000000000000006044820152606401610491565b600d8054610607906001906122f8565b8154811061063e577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600091825260209091200154600d805473ffffffffffffffffffffffffffffffffffffffff909216918390811061069e577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600d80548061071e577f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b600082815260209081902082017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90810180547fffffffffffffffffffffffff000000000000000000000000000000000000000016905590910190915560408051808201909152600a5473ffffffffffffffffffffffffffffffffffffffff168152600b54918101919091526107b490836117e2565b6040805173ffffffffffffffffffffffffffffffffffffffff841681524260208201527fc4a67a0877d477de99d765a3d9f48abfbe6181dff4727d68c3cb60715555417591015b60405180910390a15050565b600454421015610873576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4552524f523a204e6f74206578706972656400000000000000000000000000006044820152606401610491565b600c5460ff166108e5576000546040805180820190915260085473ffffffffffffffffffffffffffffffffffffffff908116825260095460208301526108b992166117e2565b600c80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790555b6003546040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009173ffffffffffffffffffffffffffffffffffffffff16906370a082319060240160206040518083038186803b15801561094f57600080fd5b505afa158015610963573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610987919061211b565b600a5460035491925073ffffffffffffffffffffffffffffffffffffffff918216911614156109ce57600d54600b546109ca916109c3916122bb565b829061181b565b9150505b6006546003546109f89173ffffffffffffffffffffffffffffffffffffffff918216911683611841565b50565b60005473ffffffffffffffffffffffffffffffffffffffff163314610aa2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f4f6e6c792063726561746f722063616e2063616c6c20746869732066756e637460448201527f696f6e00000000000000000000000000000000000000000000000000000000006064820152608401610491565b6006547801000000000000000000000000000000000000000000000000900460ff161515600114610b55576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603d60248201527f4552524f523a2043616e27742073657420746865207768697465206c6973742060448201527f746f2061206e6f6e2d77686974656c697374656420636f6e74726163740000006064820152608401610491565b6000805b82518163ffffffff161015610bf457610bb7838263ffffffff1681518110610baa577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015161171a565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14610be257600191505b80610bec816123c8565b915050610b59565b508015610c83576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f4552524f523a204f6e65206f72206d6f726520706c617965727320697320616c60448201527f726561647920696e2077686974656c69737400000000000000000000000000006064820152608401610491565b8151610c9690600d906020850190611dfd565b507fb1565d66d9899787abe67ac307850cf339a24f69de2bf7ffa4179e0eaeb939b082426040516107fb9291906121fc565b6000610cd38261171a565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff141590505b919050565b6060600d805480602002602001604051908101604052809291908181526020018280548015610d6357602002820191906000526020600020905b815473ffffffffffffffffffffffffffffffffffffffff168152600190910190602001808311610d38575b5050505050905090565b60078181548110610d7d57600080fd5b9060005260206000209060030201600091509050806000018054610da09061233b565b80601f0160208091040260200160405190810160405280929190818152602001828054610dcc9061233b565b8015610e195780601f10610dee57610100808354040283529160200191610e19565b820191906000526020600020905b815481529060010190602001808311610dfc57829003601f168201915b505050506001830154600290930154919273ffffffffffffffffffffffffffffffffffffffff1691905083565b60055473ffffffffffffffffffffffffffffffffffffffff163314610ec7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552524f523a2053656e646572206e6f7420676f7665726e00000000000000006044820152606401610491565b8351610f2f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4552524f523a204e6f2065766964656e636500000000000000000000000000006044820152606401610491565b6003546040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009173ffffffffffffffffffffffffffffffffffffffff16906370a082319060240160206040518083038186803b158015610f9957600080fd5b505afa158015610fad573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fd1919061211b565b905081156110675760085460035473ffffffffffffffffffffffffffffffffffffffff9081169116141561101a5760095460009061101090839061181b565b945061101e915050565b8092505b600a5460035473ffffffffffffffffffffffffffffffffffffffff9081169116141561106757600d54600b546000916110629161105b91906122bb565b859061181b565b945050505b60085460035473ffffffffffffffffffffffffffffffffffffffff90811691161415611133576000611099828561181b565b915050600860010154811015611131576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f4552524f523a2053686f756c64206e6f742065786365656420616c6c6f77656460448201527f20626f756e7479000000000000000000000000000000000000000000000000006064820152608401610491565b505b821561115d5760035461115d9073ffffffffffffffffffffffffffffffffffffffff168585611841565b6040805160608101825286815273ffffffffffffffffffffffffffffffffffffffff86166020808301919091529181018590526007805460018101825560009190915281518051929360039092027fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68801926111db9284920190611e87565b5060208201516001820180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff909216919091179055604091820151600290910155517fa1c3b325aa2c115e4b244062eba2515bc5585ae5b41556be8fef399ae9fde11b9061126590879087908790612231565b60405180910390a15050505050565b600280546112819061233b565b80601f01602080910402602001604051908101604052809291908181526020018280546112ad9061233b565b80156112fa5780601f106112cf576101008083540402835291602001916112fa565b820191906000526020600020905b8154815290600101906020018083116112dd57829003601f168201915b505050505081565b6006547801000000000000000000000000000000000000000000000000900460ff16156113b1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603760248201527f4552524f523a2043616e27742073656c6620726567697374657220616e64207060448201527f6c617920612077686974656c69737465642051756573740000000000000000006064820152608401610491565b3373ffffffffffffffffffffffffffffffffffffffff821614806113ec575060005473ffffffffffffffffffffffffffffffffffffffff1633145b611477576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f4552524f523a2053656e646572206e6f7420706c61796572206e6f722063726560448201527f61746f72000000000000000000000000000000000000000000000000000000006064820152608401610491565b60065474010000000000000000000000000000000000000000900463ffffffff1615806114c65750600654600d547401000000000000000000000000000000000000000090910463ffffffff16115b61152c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f4552524f523a204d617820706c617965727320726561636865640000000000006044820152606401610491565b6004544210611597576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f4552524f523a20517565737420657870697265640000000000000000000000006044820152606401610491565b60006115a28261171a565b9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1461162d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601c60248201527f4552524f523a20506c6179657220616c726561647920657869737473000000006044820152606401610491565b60408051808201909152600a5473ffffffffffffffffffffffffffffffffffffffff168152600b54602082015261166590333061191a565b600d80546001810182556000919091527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb50180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff8416908117909155604080519182524260208301527f35ec60f951b4abc8b287ab5148caf98524052482927d42e86a720cc71b8a76a191016107fb565b600180546112819061233b565b6000805b600d548110156117ba578273ffffffffffffffffffffffffffffffffffffffff16600d8281548110611779577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60009182526020909120015473ffffffffffffffffffffffffffffffffffffffff1614156117a8579050610cf9565b806117b28161238f565b91505061171e565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff92915050565b60208201511561181757602082015182516118179173ffffffffffffffffffffffffffffffffffffffff909116908390611841565b5050565b600080838311156118315750600090508061183a565b50600190508183035b9250929050565b60405173ffffffffffffffffffffffffffffffffffffffff83166024820152604481018290526119159084907fa9059cbb00000000000000000000000000000000000000000000000000000000906064015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009093169290921790915261192e565b505050565b6119248383611a3d565b61191583826117e2565b6000611990826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff16611b8d9092919063ffffffff16565b90508051600014806119b15750808060200190518101906119b1919061200e565b611915576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610491565b6020820151156118175781516040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8381166004830152306024830152600092169063dd62ed3e9060440160206040518083038186803b158015611ab857600080fd5b505afa158015611acc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611af0919061211b565b90508260200151811015611b60576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f4552524f52203a204465706f7369742062616420616c6c6f77616e63650000006044820152606401610491565b602083015183516119159173ffffffffffffffffffffffffffffffffffffffff9091169084903090611ba4565b6060611b9c8484600085611c08565b949350505050565b60405173ffffffffffffffffffffffffffffffffffffffff80851660248301528316604482015260648101829052611c029085907f23b872dd0000000000000000000000000000000000000000000000000000000090608401611893565b50505050565b606082471015611c9a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610491565b6000808673ffffffffffffffffffffffffffffffffffffffff168587604051611cc391906121cd565b60006040518083038185875af1925050503d8060008114611d00576040519150601f19603f3d011682016040523d82523d6000602084013e611d05565b606091505b5091509150611d1687838387611d21565b979650505050505050565b60608315611db4578251611dad5773ffffffffffffffffffffffffffffffffffffffff85163b611dad576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610491565b5081611b9c565b611b9c8383815115611dc95781518083602001fd5b806040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610491919061221e565b828054828255906000526020600020908101928215611e77579160200282015b82811115611e7757825182547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff909116178255602090920191600190910190611e1d565b50611e83929150611efb565b5090565b828054611e939061233b565b90600052602060002090601f016020900481019282611eb55760008555611e77565b82601f10611ece57805160ff1916838001178555611e77565b82800160010185558215611e77579182015b82811115611e77578251825591602001919060010190611ee0565b5b80821115611e835760008155600101611efc565b803573ffffffffffffffffffffffffffffffffffffffff81168114610cf957600080fd5b8035610cf98161244a565b600060208284031215611f50578081fd5b611f5982611f10565b9392505050565b60006020808385031215611f72578182fd5b823567ffffffffffffffff80821115611f89578384fd5b818501915085601f830112611f9c578384fd5b813581811115611fae57611fae61241b565b8381029150611fbe84830161226c565b8181528481019084860184860187018a1015611fd8578788fd5b8795505b8386101561200157611fed81611f10565b835260019590950194918601918601611fdc565b5098975050505050505050565b60006020828403121561201f578081fd5b8151611f598161244a565b6000806000806080858703121561203f578283fd5b843567ffffffffffffffff80821115612056578485fd5b818701915087601f830112612069578485fd5b813560208282111561207d5761207d61241b565b6120ad817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8501160161226c565b925081835289818386010111156120c2578687fd5b8181850182850137868183850101528297506120df818a01611f10565b965050505050604085013591506120f860608601611f34565b905092959194509250565b600060208284031215612114578081fd5b5035919050565b60006020828403121561212c578081fd5b5051919050565b6000815180845260208085019450808401835b8381101561217857815173ffffffffffffffffffffffffffffffffffffffff1687529582019590820190600101612146565b509495945050505050565b6000815180845261219b81602086016020860161230f565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b600082516121df81846020870161230f565b9190910192915050565b600060208252611f596020830184612133565b60006040825261220f6040830185612133565b90508260208301529392505050565b600060208252611f596020830184612183565b6000606082526122446060830186612183565b73ffffffffffffffffffffffffffffffffffffffff9490941660208301525060400152919050565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff811182821017156122b3576122b361241b565b604052919050565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156122f3576122f36123ec565b500290565b60008282101561230a5761230a6123ec565b500390565b60005b8381101561232a578181015183820152602001612312565b83811115611c025750506000910152565b60028104600182168061234f57607f821691505b60208210811415612389577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156123c1576123c16123ec565b5060010190565b600063ffffffff808316818114156123e2576123e26123ec565b6001019392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b80151581146109f857600080fdfea26469706673582212201d95e7743bcb101068cc9a865b5573cbcd2079b13e70e82b4992d89773670e1c64736f6c63430008020033";
