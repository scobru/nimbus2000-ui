// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

interface IOracle {
  function updateReporter(address reporterAddress, bool isReporter) external;

  function getReporter(address reporterAddress) external view returns (bool);

  function updateData( string memory payload) external;

  function getData() external view returns (bool results, uint date, string memory payload);
}