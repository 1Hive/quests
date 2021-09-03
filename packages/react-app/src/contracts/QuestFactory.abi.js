module.exports = [
  {
    inputs: [{ internalType: 'address', name: '_aragonGovernAddress', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'questAddress', type: 'address' },
      { indexed: false, internalType: 'string', name: '_content', type: 'string' },
    ],
    name: 'QuestCreated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'aragonGovernAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_content', type: 'string' },
      { internalType: 'uint256', name: '_terminationDate', type: 'uint256' },
      { internalType: 'address', name: '_fallbackAddress', type: 'address' },
    ],
    name: 'createQuest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
