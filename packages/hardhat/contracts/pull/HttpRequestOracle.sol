// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../lib/RequestLib.sol";

error OnlyReporter();

contract HttpRequestOracle is Ownable {
  using RequestLib for RequestLib.Request;

  mapping(address => bool) reporters;

  event RequestSent(bytes32 indexed id, bytes data);
  event RequestFulfilled(bytes32 indexed id);
  event RequestCancelled(bytes32 indexed id);

  function updateReporter(address reporterAddress, bool isReporter) external onlyOwner {
    reporters[reporterAddress] = isReporter;
  }

  function getReporter(address reporterAddress) external view returns (bool) {
    return reporters[reporterAddress];
  }

  function _hasReporter(address reporterAddress) private view returns (bool) {
    return reporters[reporterAddress];
  }

  function sendRequest(RequestLib.Request memory req) external returns (bytes32) {
    bytes memory encodedRequest = abi.encodeWithSelector(
      this.updateReporter.selector,
      req.id,
      req.callbackFunctionId,
      req.requestData.buf
    );
    emit RequestSent(req.id, encodedRequest);
    return req.id;
  }
}