// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error OnlyReporter();

contract PriceOracle is Ownable, IOracle {
  mapping(address => bool) reporters;
  Data private data;

  event PredictedSignalUpdate( address indexed reporter, string payload);

  struct Data {
    uint date;
    string payload;
  }

  function updateReporter(address reporterAddress, bool isReporter) external onlyOwner {
    reporters[reporterAddress] = isReporter;
  }

  function getReporter(address reporterAddress) external view returns (bool) {
    return reporters[reporterAddress];
  }

  function updateData(string memory payload) external {
    if (!_hasReporter(msg.sender)) {
      revert OnlyReporter();
    }
    data = Data(block.timestamp, payload);
    emit PredictedSignalUpdate( msg.sender, payload);
  }

  function getData() external view returns (bool results, uint date, string memory payload) {
    if (data.date == 0) {
      return (false, 0, "");
    }
    return (true, data.date, data.payload);
  }

  function _hasReporter(address reporterAddress) private view returns (bool) {
    return reporters[reporterAddress];
  }
}