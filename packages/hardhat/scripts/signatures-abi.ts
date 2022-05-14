

export const executeABI = {
    "inputs": [
      {
        "components": [
          {
            "components": [
              { "internalType": "uint256", "name": "nonce", "type": "uint256" },
              {
                "internalType": "uint256",
                "name": "executionTime",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "submitter",
                "type": "address"
              },
              {
                "internalType": "contract IERC3000Executor",
                "name": "executor",
                "type": "address"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  },
                  { "internalType": "bytes", "name": "data", "type": "bytes" }
                ],
                "internalType": "struct ERC3000Data.Action[]",
                "name": "actions",
                "type": "tuple[]"
              },
              {
                "internalType": "bytes32",
                "name": "allowFailuresMap",
                "type": "bytes32"
              },
              { "internalType": "bytes", "name": "proof", "type": "bytes" }
            ],
            "internalType": "struct ERC3000Data.Payload",
            "name": "payload",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "executionDelay",
                "type": "uint256"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ERC3000Data.Collateral",
                "name": "scheduleDeposit",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ERC3000Data.Collateral",
                "name": "challengeDeposit",
                "type": "tuple"
              },
              {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
              },
              { "internalType": "bytes", "name": "rules", "type": "bytes" },
              {
                "internalType": "uint256",
                "name": "maxCalldataSize",
                "type": "uint256"
              }
            ],
            "internalType": "struct ERC3000Data.Config",
            "name": "config",
            "type": "tuple"
          }
        ],
        "internalType": "struct ERC3000Data.Container",
        "name": "_container",
        "type": "tuple"
      }
    ],
    "name": "execute",
    "outputs": [
      { "internalType": "bytes32", "name": "failureMap", "type": "bytes32" },
      { "internalType": "bytes[]", "name": "", "type": "bytes[]" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  };


export const resolveABI = {
    "inputs": [
      {
        "components": [
          {
            "components": [
              { "internalType": "uint256", "name": "nonce", "type": "uint256" },
              {
                "internalType": "uint256",
                "name": "executionTime",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "submitter",
                "type": "address"
              },
              {
                "internalType": "contract IERC3000Executor",
                "name": "executor",
                "type": "address"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  },
                  { "internalType": "bytes", "name": "data", "type": "bytes" }
                ],
                "internalType": "struct ERC3000Data.Action[]",
                "name": "actions",
                "type": "tuple[]"
              },
              {
                "internalType": "bytes32",
                "name": "allowFailuresMap",
                "type": "bytes32"
              },
              { "internalType": "bytes", "name": "proof", "type": "bytes" }
            ],
            "internalType": "struct ERC3000Data.Payload",
            "name": "payload",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "executionDelay",
                "type": "uint256"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ERC3000Data.Collateral",
                "name": "scheduleDeposit",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ERC3000Data.Collateral",
                "name": "challengeDeposit",
                "type": "tuple"
              },
              {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
              },
              { "internalType": "bytes", "name": "rules", "type": "bytes" },
              {
                "internalType": "uint256",
                "name": "maxCalldataSize",
                "type": "uint256"
              }
            ],
            "internalType": "struct ERC3000Data.Config",
            "name": "config",
            "type": "tuple"
          }
        ],
        "internalType": "struct ERC3000Data.Container",
        "name": "_container",
        "type": "tuple"
      },
      { "internalType": "uint256", "name": "_disputeId", "type": "uint256" }
    ],
    "name": "resolve",
    "outputs": [
      { "internalType": "bytes32", "name": "failureMap", "type": "bytes32" },
      { "internalType": "bytes[]", "name": "", "type": "bytes[]" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }

export const challengeABI = {
    "inputs": [
      {
        "components": [
          {
            "components": [
              { "internalType": "uint256", "name": "nonce", "type": "uint256" },
              {
                "internalType": "uint256",
                "name": "executionTime",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "submitter",
                "type": "address"
              },
              {
                "internalType": "contract IERC3000Executor",
                "name": "executor",
                "type": "address"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  },
                  { "internalType": "bytes", "name": "data", "type": "bytes" }
                ],
                "internalType": "struct ERC3000Data.Action[]",
                "name": "actions",
                "type": "tuple[]"
              },
              {
                "internalType": "bytes32",
                "name": "allowFailuresMap",
                "type": "bytes32"
              },
              { "internalType": "bytes", "name": "proof", "type": "bytes" }
            ],
            "internalType": "struct ERC3000Data.Payload",
            "name": "payload",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "executionDelay",
                "type": "uint256"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ERC3000Data.Collateral",
                "name": "scheduleDeposit",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ERC3000Data.Collateral",
                "name": "challengeDeposit",
                "type": "tuple"
              },
              {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
              },
              { "internalType": "bytes", "name": "rules", "type": "bytes" },
              {
                "internalType": "uint256",
                "name": "maxCalldataSize",
                "type": "uint256"
              }
            ],
            "internalType": "struct ERC3000Data.Config",
            "name": "config",
            "type": "tuple"
          }
        ],
        "internalType": "struct ERC3000Data.Container",
        "name": "_container",
        "type": "tuple"
      },
      { "internalType": "bytes", "name": "_reason", "type": "bytes" }
    ],
    "name": "challenge",
    "outputs": [
      { "internalType": "uint256", "name": "disputeId", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }

export const scheduleABI = {
    "inputs": [
      {
        "components": [
          {
            "components": [
              { "internalType": "uint256", "name": "nonce", "type": "uint256" },
              {
                "internalType": "uint256",
                "name": "executionTime",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "submitter",
                "type": "address"
              },
              {
                "internalType": "contract IERC3000Executor",
                "name": "executor",
                "type": "address"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  },
                  { "internalType": "bytes", "name": "data", "type": "bytes" }
                ],
                "internalType": "struct ERC3000Data.Action[]",
                "name": "actions",
                "type": "tuple[]"
              },
              {
                "internalType": "bytes32",
                "name": "allowFailuresMap",
                "type": "bytes32"
              },
              { "internalType": "bytes", "name": "proof", "type": "bytes" }
            ],
            "internalType": "struct ERC3000Data.Payload",
            "name": "payload",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "executionDelay",
                "type": "uint256"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ERC3000Data.Collateral",
                "name": "scheduleDeposit",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ERC3000Data.Collateral",
                "name": "challengeDeposit",
                "type": "tuple"
              },
              {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
              },
              { "internalType": "bytes", "name": "rules", "type": "bytes" },
              {
                "internalType": "uint256",
                "name": "maxCalldataSize",
                "type": "uint256"
              }
            ],
            "internalType": "struct ERC3000Data.Config",
            "name": "config",
            "type": "tuple"
          }
        ],
        "internalType": "struct ERC3000Data.Container",
        "name": "_container",
        "type": "tuple"
      }
    ],
    "name": "schedule",
    "type": "function"
  }
