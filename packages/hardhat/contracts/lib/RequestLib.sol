// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {Buffer} from "./Buffer.sol";
import {BufferBase} from "./BufferBase.sol";

library RequestLib {
  using Buffer for BufferBase.buffer;

  struct Request {
    bytes32 id;
    address callbackAddress;
    bytes4 callbackFunctionId;
    BufferBase.buffer requestData;
  }

  function initialize(
    Request memory self,
    address callbackAddr,
    bytes4 callbackFunc
  ) internal pure returns (Request memory) {
    self.callbackAddress = callbackAddr;
    self.callbackFunctionId = callbackFunc;
    return self;
  }

  function setId(Request memory self, bytes32 id) internal pure {
    self.id = id;
  }

  function add(Request memory self, string memory key, string memory value) internal pure {
    self.requestData.encodeString(key);
    self.requestData.encodeString(value);
  }

  function addHeader(Request memory self, string memory headerKey, string memory value) internal pure {
    self.requestData.encodeString(" header(");
    self.requestData.encodeString(headerKey);
    self.requestData.encodeString(value);
    self.requestData.encodeString(") ");
  }
}