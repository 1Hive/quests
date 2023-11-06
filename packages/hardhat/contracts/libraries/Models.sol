// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

library Models {
    struct Deposit {
        IERC20Upgradeable token;
        uint256 amount;
    }
    struct Claim {
        bytes evidence;
        address player;
        uint256 amount;
    }
    struct QuestParam {
        address questCreator;
        uint32 maxPlayers;
        IERC20Upgradeable rewardToken;
        uint256 expireTime;
        address aragonGovernAddress;
        address payable fundsRecoveryAddress;
        bool isWhiteList;
    }
}
