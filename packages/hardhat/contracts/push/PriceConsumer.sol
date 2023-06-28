// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IOracle.sol";

error CouldNotGetPrice();
error StalePrice();

contract PriceConsumer {
  IOracle public oracle;

  constructor(address _oracle) {
    oracle = IOracle(_oracle);
  }

  function getPredictedSignal() external view returns (string memory) {
    (bool found, uint timestamp, string memory predictedSignal) = oracle.getData();
    if (!found) {
      revert CouldNotGetPrice();
    }
    if (block.timestamp - timestamp >= 3 minutes) {
      revert StalePrice();
    }
    return predictedSignal;
  }
}