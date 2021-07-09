// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Quest.sol";


contract QuestFactory {

    address public aragonGovernAddress;

    event QuestCreated(address questAddress, bytes _requirements);

    constructor(address _aragonGovernAddress) {
        aragonGovernAddress = _aragonGovernAddress;
    }

    function createQuest(
        bytes memory _requirements,
        IERC20 _rewardToken,
        uint256 _expireTime,
        address payable _fundsRecoveryAddress
    ) 
        external 
    {
        Quest quest = new Quest(_requirements, _rewardToken, _expireTime, aragonGovernAddress, _fundsRecoveryAddress);
        emit QuestCreated(address(quest), _requirements);
    }
}
