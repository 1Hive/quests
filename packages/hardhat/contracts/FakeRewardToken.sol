// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Example class - a mock class using delivering from ERC20
contract FakeRewardToken is ERC20 {
  uint256 initialBalance;

  constructor(uint256 _initialBalance) ERC20("Basic", "BSC") {
    initialBalance = _initialBalance;
  }

  function mint(address owner) external {
    _mint(owner, initialBalance);
  }
}
