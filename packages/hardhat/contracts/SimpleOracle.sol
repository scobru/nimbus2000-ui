pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleOracle is Ownable {
  // create enum struct
  enum Status {
    Buy,
    Sell
  }

  // current status variable
  Status public currentStatus;
  uint256 public lastUpdated;

  // create event
  event StatusChange(Status indexed status, uint256 timestamp);

  // constructor to set initial status
  constructor(Status initialStatus) {
    currentStatus = initialStatus;
  }

  // create function to change status
  function changeStatus(Status status) external onlyOwner {
    currentStatus = status;
    lastUpdated = block.timestamp;
    emit StatusChange(status, lastUpdated);
  }

  // create function to get status
  function getStatus() external view returns (Status) {
    return currentStatus;
  }
}
