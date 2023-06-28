const contracts = {
  137: [
    {
      chainId: "137",
      name: "polygon",
      contracts: {
        HttpRequestConsumer: {
          address: "0x9cf29F3172c7CA146686a4A7039D23F5f63d4B7b",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_oracle",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [],
              name: "FakeReporter",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "requestId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "volume",
                  type: "uint256",
                },
              ],
              name: "RequestVolume",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "_requestId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "_volume",
                  type: "uint256",
                },
              ],
              name: "_requestedDataCompleted",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "requestPriceData",
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
          ],
        },
        HttpRequestConsumerWithHeader: {
          address: "0x21f5C4f2a0898Aa3EaFfdcb644dFeF30e95cC359",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_oracle",
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
                  indexed: true,
                  internalType: "bytes32",
                  name: "requestId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "prediction_signal",
                  type: "string",
                },
              ],
              name: "RequestExchangeRate",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "_requestId",
                  type: "bytes32",
                },
                {
                  internalType: "string",
                  name: "_prediction_signal",
                  type: "string",
                },
              ],
              name: "_requestedDataCompleted",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        HttpRequestOracle: {
          address: "0xeEfF3CBaEE039aC7e24e079dd6b775c90F59232b",
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
      },
    },
  ],
} as const;

export default contracts;
