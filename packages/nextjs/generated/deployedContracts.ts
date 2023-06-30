const contracts = {
  137: [
    {
      chainId: "137",
      name: "polygon",
      contracts: {
        HttpRequestOracle: {
          address: "0xe127C747024ebf28e27AaB3658D5E8057249a059",
          abi: [
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
                  indexed: true,
                  internalType: "bytes32",
                  name: "id",
                  type: "bytes32",
                },
              ],
              name: "RequestCancelled",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "id",
                  type: "bytes32",
                },
              ],
              name: "RequestFulfilled",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "id",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "RequestSent",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "reporterAddress",
                  type: "address",
                },
              ],
              name: "getReporter",
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
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes32",
                      name: "id",
                      type: "bytes32",
                    },
                    {
                      internalType: "address",
                      name: "callbackAddress",
                      type: "address",
                    },
                    {
                      internalType: "bytes4",
                      name: "callbackFunctionId",
                      type: "bytes4",
                    },
                    {
                      components: [
                        {
                          internalType: "bytes",
                          name: "buf",
                          type: "bytes",
                        },
                        {
                          internalType: "uint256",
                          name: "capacity",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct BufferBase.buffer",
                      name: "requestData",
                      type: "tuple",
                    },
                  ],
                  internalType: "struct RequestLib.Request",
                  name: "req",
                  type: "tuple",
                },
              ],
              name: "sendRequest",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
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
            {
              inputs: [
                {
                  internalType: "address",
                  name: "reporterAddress",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "isReporter",
                  type: "bool",
                },
              ],
              name: "updateReporter",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        SimpleOracle: {
          address: "0xBf5ec3570909D09D817F2AA4FD3Ad607090AaD46",
          abi: [
            {
              inputs: [
                {
                  internalType: "enum SimpleOracle.Status",
                  name: "initialStatus",
                  type: "uint8",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
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
                  indexed: true,
                  internalType: "enum SimpleOracle.Status",
                  name: "status",
                  type: "uint8",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "StatusChange",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "enum SimpleOracle.Status",
                  name: "status",
                  type: "uint8",
                },
              ],
              name: "changeStatus",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "currentStatus",
              outputs: [
                {
                  internalType: "enum SimpleOracle.Status",
                  name: "",
                  type: "uint8",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "getStatus",
              outputs: [
                {
                  internalType: "enum SimpleOracle.Status",
                  name: "",
                  type: "uint8",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "lastUpdated",
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
              name: "renounceOwnership",
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
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
