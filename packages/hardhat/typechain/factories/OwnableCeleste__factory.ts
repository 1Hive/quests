/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { OwnableCeleste } from "../OwnableCeleste";

export class OwnableCeleste__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _feeToken: string,
    _feeAmount: BigNumberish,
    overrides?: Overrides
  ): Promise<OwnableCeleste> {
    return super.deploy(
      _feeToken,
      _feeAmount,
      overrides || {}
    ) as Promise<OwnableCeleste>;
  }
  getDeployTransaction(
    _feeToken: string,
    _feeAmount: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(_feeToken, _feeAmount, overrides || {});
  }
  attach(address: string): OwnableCeleste {
    return super.attach(address) as OwnableCeleste;
  }
  connect(signer: Signer): OwnableCeleste__factory {
    return super.connect(signer) as OwnableCeleste__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OwnableCeleste {
    return new Contract(address, _abi, signerOrProvider) as OwnableCeleste;
  }
}

const _abi = [
  {
    constant: false,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_disputeId",
        type: "uint256",
      },
      {
        name: "_state",
        type: "uint8",
      },
    ],
    name: "decideDispute",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "disputes",
    outputs: [
      {
        name: "subject",
        type: "address",
      },
      {
        name: "state",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeToken",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeAmount",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getDisputeFees",
    outputs: [
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_disputeId",
        type: "uint256",
      },
      {
        name: "_submitter",
        type: "address",
      },
      {
        name: "_evidence",
        type: "bytes",
      },
    ],
    name: "submitEvidence",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_disputeId",
        type: "uint256",
      },
    ],
    name: "closeEvidencePeriod",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_disputeId",
        type: "uint256",
      },
    ],
    name: "computeRuling",
    outputs: [
      {
        name: "subject",
        type: "address",
      },
      {
        name: "finalRuling",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_possibleRulings",
        type: "uint256",
      },
      {
        name: "_metadata",
        type: "bytes",
      },
    ],
    name: "createDispute",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_disputeId",
        type: "uint256",
      },
    ],
    name: "rule",
    outputs: [
      {
        name: "subject",
        type: "address",
      },
      {
        name: "ruling",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getDisputeManager",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "currentId",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_feeToken",
        type: "address",
      },
      {
        name: "_feeAmount",
        type: "uint256",
      },
    ],
    name: "setFee",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_feeToken",
        type: "address",
      },
      {
        name: "_feeAmount",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
];

const _bytecode =
  "0x000300000000000200020000000103550000006001100270000000a20010019d000100000000001f0000000101200190000000090000c13d0000000001000019028100620000040f0000000101000039028100620000040f0001000000000002000100000005001d000000a205000041000000a20630009c00000000030580190000004003300210000000a20640009c00000000040580190000006004400210000000000334019f000000a20410009c0000000001058019000000c001100210000000000113019f028102770000040f000000010900002900000000030100190000006003300270000000a203300197000000200430008c000000200500003900000000050340190000001f0450018f00000005055002720000002d0000613d000000000600001900000005076002100000000008790019000000000771034f000000000707043b00000000007804350000000106600039000000000756004b000000250000413d000000010220018f000000000640004c0000003d0000613d0000000505500210000000000151034f00000000055900190000000304400210000000000605043300000000064601cf000000000646022f000000000101043b0000010004400089000000000141022f00000000014101cf000000000161019f0000000000150435000100000003001f0000000001020019000000000001042d000000a2010000410000000002000414000000a20320009c0000000001024019000000c001100210000000a3011001c700008010020000390281027c0000040f00000001022001900000004c0000613d000000000101043b000000000001042d00000000010000190000000002000019028100590000040f000000a204000041000000a20510009c000000000104801900000040011002100000000001310019000000a20320009c000000000204801900000060022002100000000001210019000002820001042e000000a203000041000000a20420009c0000000002038019000000a20410009c000000000103801900000040011002100000006002200210000000000112019f000002830001043000060000000000020000008002000039000000400020043f0000000002000416000000000110004c000000910000613d000000000120004c000000960000c13d0000000202000367000000400100043d000000000300001900000005043002100000000005410019000000000442034f000000000404043b00000000004504350000000103300039000000020430008c0000006d0000413d0000004002100039000000400020043f000000410200008a000000000221004b000000960000213d0000000302000039000000000302041a000000ab033001970000000004000411000000000334019f000000200410003900000000040404330000000001010433000000000032041b000000aa01100197000000000200041a000000ab02200197000000000112019f000000000010041b0000000101000039000000000041041b00000020010000390000010000100443000001200000044300000100010000390000004002000039000000c3030000410281004f0000040f000000000120004c000000960000c13d0000000002000031000000030120008c000000990000213d00000000010000190000000002000019028100590000040f0000000201000367000000000401043b000000e003400270000000a40540009c000000b30000813d000000b70440009c000000bf0000813d000000bd0430009c000000e80000c13d000000240220008a000000200300008a000000000232004b000000960000813d0000000302000039000000000302041a000000aa043001970000000005000411000000000445004b000002110000c13d000000ab033001970000000401100370000000000101043b000000aa01100197000000000131019f000000000012041b000000bb0000013d000000a50440009c000000c30000813d000000ae0430009c0000010d0000c13d000000240120008a000000200200008a000000000121004b000000960000813d0000000001000019000000000200001900000000030000190281004f0000040f000000b80430009c000001190000c13d000000000100041a000001110000013d000000a60430009c0000011e0000c13d000000240220008a000000200300008a000000000232004b000000960000813d0000000401100370000000000101043b00000000001004350000000401000039000600000001001d000000200010043f028100400000040f000000000101041a000000a002100270000000ff0220018f000000050320008c000000960000813d0000000303000039000000030420008c000000de0000613d000000040320008c0000000603000029000000de0000613d000000020220008c0000000003000019000002210000c13d000000400200043d00000020042000390000000000340435000000aa011001970000000000120435000000400100043d0000000002120049000000400220003900000000030000190281004f0000040f000000be0430009c000001290000c13d000000440220008a000000400300008a000000000232004b000000960000813d0000000402100370000000000202043b0000002401100370000000000101043b0000000303000039000000000303041a000000aa033001970000000004000411000000000334004b000002110000c13d000000ff0310018f000000040130008c000000960000213d000000020130008c000002310000813d000000400200043d0000004401200039000000c103000041000000000031043500000024012000390000001a030000390000000000310435000000ad010000410000000000120435000000040120003900000020030000390000000000310435000000400100043d00000000021200490000006402200039028100590000040f000000af0430009c000001440000c13d0000000301000039000000000101041a000000aa01100197000000400200043d0000000000120435000000400100043d0000000002120049000000200220003900000000030000190281004f0000040f000000b90430009c0000015f0000c13d0000000101000039000000000101041a000001760000013d000000a70430009c000001720000c13d0000000001000410000000aa01100197000000400200043d0000000000120435000000400100043d0000000002120049000000200220003900000000030000190281004f0000040f000000bf0330009c000000960000c13d000000240220008a000000200300008a000000000232004b000000960000813d0000000401100370000000000101043b0000000402000039000000200020043f0000000000100435028100400000040f000000000101041a000000aa03100197000000400200043d0000000000320435000000a001100270000000ff0110018f000000050310008c000000960000813d00000020032000390000000000130435000000400100043d0000000002120049000000400220003900000000030000190281004f0000040f000000b00430009c0000017d0000c13d000000240220008a000000200300008a000000000232004b000000960000813d0000000401100370000000000101043b00000000001004350000000401000039000000200010043f028100400000040f000000000101041a000000aa03100197000000400200043d0000000000320435000000a001100270000000ff0110018f000000050310008c000000960000813d00000020032000390000000000130435000000400100043d0000000002120049000000400220003900000000030000190281004f0000040f000000ba0430009c000001e30000c13d0000000101000039000000000101041a000000400200043d0000004003200039000000000400041a0000000000130435000000aa01400197000000200320003900000000001304350000000001000410000000aa011001970000000000120435000000400100043d0000000002120049000000600220003900000000030000190281004f0000040f000000a80430009c000001f90000c13d0000000201000039000000000101041a000000400200043d0000000000120435000000400100043d0000000002120049000000200220003900000000030000190281004f0000040f000000b10330009c000000960000c13d000000440320008a000000400400008a000000000343004b000000960000813d0000002403100370000000000403043b000000b20340009c000000960000213d0000002403400039000000000523004b000000960000213d0000000404400039000000000141034f000000000101043b000000b20410009c000000960000213d0000000001310019000000000121004b000000960000213d0000000201000039000300000001001d000000000201041a000000400400043d000500000004001d0000004001400039000000400010043f0000002003400039000600000003001d0000000101000039000200000001001d00000000001304350000000001000411000400000001001d0000000000140435000100000002001d00000000002004350000000401000039000000200010043f028100400000040f00000005020000290000000002020433000000aa02200197000000000301041a000000ab03300197000000000223019f000000000021041b00000006030000290000000003030433000000050430008c000000960000813d000000b302200197000000a003300210000000000223019f000000000021041b0000000302000029000000000102041a0000000101100039000000000012041b0000000201000029000000000101041a0000000002000410000000aa02200197000000400300043d0000004404300039000000000600041a00000000002404350000000402000029000000aa022001970000002404300039000000000024043500000064023000390000000000120435000000400100043d000000000212004900000000002104350000008402300039000000400020043f00000020031000390000000002030433000000b402200197000000b5022001c700000000002304350000000004010433000000400500043d0000000001000414000000aa02600197000000040620008c000002530000c13d000000000100001900000005021002100000000004250019000000000223001900000000020204330000000000240435000000010110003a000000000200001900000001020060390000000102200190000001d80000c13d000002580000013d000000bb0330009c000000960000c13d000000640320008a000000600400008a000000000343004b000000960000813d0000004403100370000000000403043b000000bc0340009c000000960000813d0000002403400039000000000523004b000000960000213d0000000404400039000000000141034f000000000101043b000000b20410009c000000960000213d0000000001310019000000000121004b000000bb0000a13d000000960000013d000000a90330009c000000960000c13d000000440220008a000000400300008a000000000232004b000000960000813d0000000302000039000000000202041a000000aa022001970000000003000411000000000223004b000002110000c13d0000000402100370000000000202043b0000002401100370000000000101043b0000000103000039000000000013041b000000aa01200197000000000200041a000000ab02200197000000000112019f000000000010041b000000bb0000013d000000400200043d0000004401200039000000c203000041000000000031043500000024012000390000000d030000390000000000310435000000ad010000410000000000120435000000040120003900000020030000390000000000310435000000400100043d00000000021200490000006402200039028100590000040f000000400200043d0000004401200039000000ac030000410000000000310435000000240120003900000010030000390000000000310435000000ad010000410000000000120435000000040120003900000020030000390000000000310435000000400100043d00000000021200490000006402200039028100590000040f00000000002004350000000401000039000000200010043f000600000003001d028100400000040f000000000201041a000000a003200270000000ff0330018f000000050430008c0000000604000029000000960000813d000000010330008c000002430000c13d000000a003400210000000b302200197000000000232019f000000000021041b000000bb0000013d000000400200043d0000004401200039000000c0030000410000000000310435000000240120003900000010030000390000000000310435000000ad010000410000000000120435000000040120003900000020030000390000000000310435000000400100043d00000000021200490000006402200039028100590000040f000600000005001d0281000b0000040f0000000605000029000000000110004c000002670000613d00000001010000320000025f0000613d000000200110008c000002670000c13d0000000001050433000000010110008c000002670000c13d000000400200043d00000001010000290000000000120435000000400100043d0000000002120049000000200220003900000000030000190281004f0000040f000000400200043d0000004401200039000000b6030000410000000000310435000000240120003900000012030000390000000000310435000000ad010000410000000000120435000000040120003900000020030000390000000000310435000000400100043d00000000021200490000006402200039028100590000040f0000027a002104210000000102000039000000000001042d0000000002000019000002790000013d0000027f002104230000000102000039000000000001042d00000000020000190000027e0000013d0000028100000432000002820001042e0000028300010430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffff02000000000000000000000000000000000000400000000000000000000000007e9adccf00000000000000000000000000000000000000000000000000000000db18af6c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db18af6c00000000000000000000000000000000000000000000000000000000db9bee4600000000000000000000000000000000000000000000000000000000e00dd16100000000000000000000000000000000000000000000000000000000e55156b5000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000554e45585045435445445f53544154450000000000000000000000000000000008c379a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007e9adccf000000000000000000000000000000000000000000000000000000008da5cb5b00000000000000000000000000000000000000000000000000000000bd881e5300000000000000000000000000000000000000000000000000000000c13517e10000000000000000000000000000000000000000000000000000000100000000ffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff23b872dd000000000000000000000000000000000000000000000000000000004552523a4445504f5349545f4641494c45440000000000000000000000000000647846a50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000647846a50000000000000000000000000000000000000000000000000000000069e15404000000000000000000000000000000000000000000000000000000007b751b9e000000000000000000000000000000000000000000000000000000007cb57c6400000000000000000000000000000000000000000000000000000001000000010000000000000000000000000000000000000000000000000000000013af4035000000000000000000000000000000000000000000000000000000001da213f200000000000000000000000000000000000000000000000000000000564a565d4552523a4e4f545f4449535055544544000000000000000000000000000000004552523a4f5554434f4d455f4e4f545f41535349474e41424c450000000000004552523a4e4f545f4f574e45520000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
