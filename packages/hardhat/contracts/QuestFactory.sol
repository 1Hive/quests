// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Quest.sol";
import "./libraries/Models.sol";

contract QuestFactory is Ownable {
    using SafeERC20 for IERC20;

    address public aragonGovernAddress;
    Models.Deposit public deposit;

    event QuestCreated(
        address questAddress,
        string questTitle,
        bytes questDetailsRef,
        address rewardTokenAddress,
        uint256 expireTime,
        uint256 creationTime,
        address depositToken,
        address depositAmount
    );

    event DepositChanged(uint256 timestamp, address token, uint256 amount);

    constructor(
        address _aragonGovernAddress,
        IERC20 _depositToken,
        uint256 _depositAmount
    ) {
        aragonGovernAddress = _aragonGovernAddress;
        setDeposit(_depositToken, _depositAmount);
    }

    function setDeposit(IERC20 token, uint256 amount) public onlyOwner {
        deposit = Models.Deposit(token, amount);
        emit DepositChanged(block.timestamp, address(token), amount);
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
            _fundsRecoveryAddress,
            deposit.token,
            deposit.amount
        );
        emit QuestCreated(
            address(quest),
            _questTitle,
            _questDetailsRef,
            address(_rewardToken),
            _expireTime,
            block.timestamp,
            deposit.token,
            deposit.amount
        );
        return address(quest);
    }
}
