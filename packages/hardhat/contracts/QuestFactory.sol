// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Quest.sol";

contract QuestFactory {
    address public aragonGovernAddress;

    event QuestCreated(
        address questAddress,
        string questTitle,
        bytes questDetailsRef,
        address rewardTokenAddress,
        uint256 expireTime,
        uint256 creationTime
    );

    constructor(address _aragonGovernAddress) {
        aragonGovernAddress = _aragonGovernAddress;
    }

    function createQuest(
        string memory _questTitle,
        bytes memory _questDetailsRef,
        IERC20 _rewardToken,
        uint256 _expireTime,
        address payable _fundsRecoveryAddress
    ) external returns (address) {
        Quest quest = new Quest(
            _questTitle,
            _questDetailsRef,
            _rewardToken,
            _expireTime,
            aragonGovernAddress,
            _fundsRecoveryAddress
        );
        emit QuestCreated(
            address(quest),
            _questTitle,
            _questDetailsRef,
            address(_rewardToken),
            _expireTime,
            block.timestamp
        );
        return address(quest);
    }
}
