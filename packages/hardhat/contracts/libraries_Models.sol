// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library Models {
    struct Deposit {
        IERC20 token;
        uint256 amount;
    }
    struct Claim {
        bytes evidence;
        address player;
        uint256 amount;
    }
}
