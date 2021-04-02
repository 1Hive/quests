module.exports = [
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
        name: "_content",
        type: "string",
      },
    ],
    name: "QuestCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_content",
        type: "string",
      },
    ],
    name: "createQuest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract Quest",
        name: "quest",
        type: "address",
      },
    ],
    name: "disable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getQuests",
    outputs: [
      {
        internalType: "contract Quest[]",
        name: "_quests",
        type: "address[]",
      },
    ],
    stateMutability: "view",
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
    name: "quests",
    outputs: [
      {
        internalType: "contract Quest",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
