// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./HttpRequestOracle.sol";
import "../lib/RequestLib.sol";

abstract contract RequestConsumer {
  using RequestLib for RequestLib.Request;

  function buildRequest(bytes4 callbackFunctionSignature) internal view returns (RequestLib.Request memory) {
    RequestLib.Request memory req;
    return req.initialize(address(this), callbackFunctionSignature);
  }
}