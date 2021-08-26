// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Example class - a mock class using delivering from ERC20
contract TokenMock is ERC20 {

    constructor() ERC20("TokenMock", "TKM") payable {
    }

    function mint(address owner, uint256 initialBalance) external {
        _mint(owner, initialBalance);
    }
}
