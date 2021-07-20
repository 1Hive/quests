// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Example class - a mock class using delivering from ERC20
contract TokenMock is ERC20 {
    uint256 initialBalance;

    constructor(uint256 _initialBalance,  string memory _name, string memory _symbol) ERC20(_name, _symbol) payable {
        initialBalance = _initialBalance;
    }

    function mint(address owner) external {
        _mint(owner, initialBalance);
    }
}
