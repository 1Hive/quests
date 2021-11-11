// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Quest.sol";

contract QuestFactory {
    address public aragonGovernAddress;

    event QuestCreated(
        address questAddress,
        string questMetadataJson,
        address rewardTokenAddress,
        uint256 expireTime,
        string version
    );

    constructor(address _aragonGovernAddress) {
        aragonGovernAddress = _aragonGovernAddress;
    }

    function createQuest(
        string memory _questMetadataJson,
        IERC20 _rewardToken,
        uint256 _expireTime,
        address payable _fundsRecoveryAddress,
        string memory _version
    ) external {
        Quest quest = new Quest(
            _questMetadataJson,
            _rewardToken,
            _expireTime,
            aragonGovernAddress,
            _fundsRecoveryAddress
        );
        emit QuestCreated(
            address(quest),
            _questMetadataJson,
            address(_rewardToken),
            _expireTime,
            _version
        );
    }
}
