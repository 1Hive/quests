/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { QuestFactory } from "../QuestFactory";

export class QuestFactory__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _aragonGovernAddress: string,
    overrides?: Overrides
  ): Promise<QuestFactory> {
    return super.deploy(
      _aragonGovernAddress,
      overrides || {}
    ) as Promise<QuestFactory>;
  }
  getDeployTransaction(
    _aragonGovernAddress: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(_aragonGovernAddress, overrides || {});
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
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516116c23803806116c283398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610082565b600060208284031215610065578081fd5b81516001600160a01b038116811461007b578182fd5b9392505050565b611631806100916000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063abec0a031461003b578063b0a87ac114610064575b600080fd5b61004e6100493660046101f8565b61006c565b60405161005b9190610316565b60405180910390f35b61004e610118565b6000808686868660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16876040516100a190610134565b6100b09695949392919061038f565b604051809103906000f0801580156100cc573d6000803e3d6000fd5b5090507ffb0c8248c4cf55e9b0b327b1c30fbe984af163644eaaa9474d783da36f0d25bb8188888888604051610106959493929190610337565b60405180910390a19695505050505050565b60005473ffffffffffffffffffffffffffffffffffffffff1681565b6111d78061042583390190565b600067ffffffffffffffff8084111561015c5761015c6103f5565b60405160207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f870116820101818110838211171561019e5761019e6103f5565b6040528481529150818385018610156101b657600080fd5b8484602083013760006020868301015250509392505050565b803573ffffffffffffffffffffffffffffffffffffffff811681146101f357600080fd5b919050565b600080600080600060a0868803121561020f578081fd5b853567ffffffffffffffff80821115610226578283fd5b818801915088601f830112610239578283fd5b61024889833560208501610141565b9650602088013591508082111561025d578283fd5b508601601f8101881361026e578182fd5b61027d88823560208401610141565b94505061028c604087016101cf565b9250606086013591506102a1608087016101cf565b90509295509295909350565b60008151808452815b818110156102d2576020818501810151868301820152016102b6565b818111156102e35782602083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff808816835260a0602084015261036760a08401886102ad565b838103604085015261037981886102ad565b9590911660608401525050608001529392505050565b600060c082526103a260c08301896102ad565b82810360208401526103b481896102ad565b73ffffffffffffffffffffffffffffffffffffffff978816604085015260608401969096525050918416608083015290921660a09092019190915292915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfe60806040523480156200001157600080fd5b50604051620011d7380380620011d783398101604081905262000034916200020d565b855162000049906000906020890190620000ac565b5084516200005f906001906020880190620000ac565b50600280546001600160a01b039586166001600160a01b03199182161790915560039390935560048054928516928416929092179091556005805491909316911617905550620003329050565b828054620000ba90620002df565b90600052602060002090601f016020900481019282620000de576000855562000129565b82601f10620000f957805160ff191683800117855562000129565b8280016001018555821562000129579182015b82811115620001295782518255916020019190600101906200010c565b50620001379291506200013b565b5090565b5b808211156200013757600081556001016200013c565b60006001600160401b03808411156200016f576200016f6200031c565b6040516020601f8601601f19168201810183811183821017156200019757620001976200031c565b8060405250819350858252868686011115620001b257600080fd5b600092505b85831015620001d4578483015182840182015291820191620001b7565b85831115620001e65760008187840101525b5050509392505050565b80516001600160a01b03811681146200020857600080fd5b919050565b60008060008060008060c0878903121562000226578182fd5b86516001600160401b03808211156200023d578384fd5b818901915089601f83011262000251578384fd5b620002628a83516020850162000152565b9750602089015191508082111562000278578384fd5b508701601f810189136200028a578283fd5b6200029b8982516020840162000152565b955050620002ac60408801620001f0565b935060608701519250620002c360808801620001f0565b9150620002d360a08801620001f0565b90509295509295509295565b600281046001821680620002f457607f821691505b602082108114156200031657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b610e9580620003426000396000f3fe608060405234801561001057600080fd5b50600436106100a35760003560e01c8063a888c2cd11610076578063e0c234231161005b578063e0c2342314610122578063f294cf3814610137578063f7c618c11461013f576100a3565b8063a888c2cd146100f8578063b0a87ac11461011a576100a3565b8063310a1ee3146100a85780634621d082146100c65780637ceae310146100d057806399b44ba0146100e5575b600080fd5b6100b0610147565b6040516100bd9190610da3565b60405180910390f35b6100ce61014d565b005b6100d8610262565b6040516100bd9190610b78565b6100ce6100f3366004610a08565b61027e565b61010b610106366004610ae2565b6104ac565b6040516100bd93929190610bd2565b6100d8610585565b61012a6105a1565b6040516100bd9190610bbf565b61012a61062f565b6100d861063c565b60035481565b6003544211610191576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018890610c6a565b60405180910390fd5b6005546002546040517f70a082310000000000000000000000000000000000000000000000000000000081526102609273ffffffffffffffffffffffffffffffffffffffff9081169216906370a08231906101f0903090600401610b78565b60206040518083038186803b15801561020857600080fd5b505afa15801561021c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102409190610afa565b60025473ffffffffffffffffffffffffffffffffffffffff169190610658565b565b60055473ffffffffffffffffffffffffffffffffffffffff1681565b60045473ffffffffffffffffffffffffffffffffffffffff1633146102cf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018890610ca1565b8251610307576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018890610d0f565b8015610336576002546103319073ffffffffffffffffffffffffffffffffffffffff168383610658565b610397565b80610397576002546040517f70a0823100000000000000000000000000000000000000000000000000000000815261039791849173ffffffffffffffffffffffffffffffffffffffff909116906370a08231906101f0903090600401610b78565b6040805160608101825284815273ffffffffffffffffffffffffffffffffffffffff84166020808301919091529181018390526006805460018101825560009190915281518051929360039092027ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f0192610415928492019061092b565b5060208201516001820180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff909216919091179055604091820151600290910155517fa1c3b325aa2c115e4b244062eba2515bc5585ae5b41556be8fef399ae9fde11b9061049f90859085908590610bd2565b60405180910390a1505050565b600681815481106104bc57600080fd5b90600052602060002090600302016000915090508060000180546104df90610ddc565b80601f016020809104026020016040519081016040528092919081815260200182805461050b90610ddc565b80156105585780601f1061052d57610100808354040283529160200191610558565b820191906000526020600020905b81548152906001019060200180831161053b57829003601f168201915b505050506001830154600290930154919273ffffffffffffffffffffffffffffffffffffffff1691905083565b60045473ffffffffffffffffffffffffffffffffffffffff1681565b600180546105ae90610ddc565b80601f01602080910402602001604051908101604052809291908181526020018280546105da90610ddc565b80156106275780601f106105fc57610100808354040283529160200191610627565b820191906000526020600020905b81548152906001019060200180831161060a57829003601f168201915b505050505081565b600080546105ae90610ddc565b60025473ffffffffffffffffffffffffffffffffffffffff1681565b6106f98363a9059cbb60e01b8484604051602401610677929190610b99565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909316929092179091526106fe565b505050565b6000610760826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff166107b49092919063ffffffff16565b8051909150156106f9578080602001905181019061077e91906109e8565b6106f9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018890610d46565b60606107c384846000856107cd565b90505b9392505050565b606082471015610809576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018890610c0d565b610812856108ce565b610848576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018890610cd8565b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040516108719190610b5c565b60006040518083038185875af1925050503d80600081146108ae576040519150601f19603f3d011682016040523d82523d6000602084013e6108b3565b606091505b50915091506108c38282866108d8565b979650505050505050565b803b15155b919050565b606083156108e75750816107c6565b8251156108f75782518084602001fd5b816040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101889190610bbf565b82805461093790610ddc565b90600052602060002090601f016020900481019282610959576000855561099f565b82601f1061097257805160ff191683800117855561099f565b8280016001018555821561099f579182015b8281111561099f578251825591602001919060010190610984565b506109ab9291506109af565b5090565b5b808211156109ab57600081556001016109b0565b803573ffffffffffffffffffffffffffffffffffffffff811681146108d357600080fd5b6000602082840312156109f9578081fd5b815180151581146107c6578182fd5b600080600060608486031215610a1c578182fd5b833567ffffffffffffffff80821115610a33578384fd5b818601915086601f830112610a46578384fd5b8135602082821115610a5a57610a5a610e30565b604051817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8501168201018181108582111715610a9b57610a9b610e30565b60405282815284830182018a1015610ab1578687fd5b828286018383013780830182018790529650610ace8882016109c4565b955050505050604084013590509250925092565b600060208284031215610af3578081fd5b5035919050565b600060208284031215610b0b578081fd5b5051919050565b60008151808452610b2a816020860160208601610dac565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60008251610b6e818460208701610dac565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b6000602082526107c66020830184610b12565b600060608252610be56060830186610b12565b73ffffffffffffffffffffffffffffffffffffffff9490941660208301525060400152919050565b60208082526026908201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60408201527f722063616c6c0000000000000000000000000000000000000000000000000000606082015260800190565b60208082526012908201527f4552524f523a204e6f7420657870697265640000000000000000000000000000604082015260600190565b60208082526018908201527f4552524f523a2053656e646572206e6f7420676f7665726e0000000000000000604082015260600190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b60208082526012908201527f4552524f523a204e6f2065766964656e63650000000000000000000000000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60408201527f6f74207375636365656400000000000000000000000000000000000000000000606082015260800190565b90815260200190565b60005b83811015610dc7578181015183820152602001610daf565b83811115610dd6576000848401525b50505050565b600281046001821680610df057607f821691505b60208210811415610e2a577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfea26469706673582212201942d8788fd5bb8dac63af94394c72d45a8459df2f2790699a41b437ac551d4064736f6c63430008000033a2646970667358221220fceada1c4b610a8891b874798e9498d3f50d4b553861cad0ff17d848c273b5c464736f6c63430008000033";
