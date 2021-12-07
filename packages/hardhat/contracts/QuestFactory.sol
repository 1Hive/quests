// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Quest.sol";

contract QuestFactory {
    address public aragonGovernAddress;

    event QuestCreated(address questAddress, string questTitle, bytes questDetailsRef, address rewardTokenAddress, uint256 expireTime);

    constructor(address _aragonGovernAddress) {
        aragonGovernAddress = _aragonGovernAddress;
    }

    function createQuest(
        string memory _questTitle,
        bytes memory _questDetailsRef,
        IERC20 _rewardToken,
        uint256 _expireTime,
        address payable _fundsRecoveryAddress
    ) external {
        Quest quest = new Quest(_questTitle, _questDetailsRef, _rewardToken, _expireTime, aragonGovernAddress, _fundsRecoveryAddress);
        emit QuestCreated(address(quest), _questTitle, _questDetailsRef, address(_rewardToken), _expireTime);
    }
}
