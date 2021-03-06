// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./libraries/Deposit.sol";
import "./libraries/Models.sol";
import "./QuestFactory.sol";

contract Quest {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using DepositLib for Models.Deposit;

    address public questCreator;
    string public questTitle;
    bytes public questDetailsRef;
    IERC20 public rewardToken;
    uint256 public expireTime;
    address public aragonGovernAddress;
    address payable public fundsRecoveryAddress;
    Models.Claim[] public claims;
    Models.Deposit public deposit;
    bool public isDepositReleased;

    event QuestClaimed(bytes evidence, address player, uint256 amount);

    constructor(
        string memory _questTitle,
        bytes memory _questDetailsRef,
        IERC20 _rewardToken,
        uint256 _expireTime,
        address _aragonGovernAddress,
        address payable _fundsRecoveryAddress,
        IERC20 _depositToken,
        uint256 _depositAmount,
        address _questCreator
    ) {
        questTitle = _questTitle;
        questDetailsRef = _questDetailsRef;
        rewardToken = _rewardToken;
        expireTime = _expireTime;
        aragonGovernAddress = _aragonGovernAddress;
        fundsRecoveryAddress = _fundsRecoveryAddress;
        questCreator = _questCreator;
        deposit = Models.Deposit(_depositToken, _depositAmount);
        isDepositReleased = false;
    }

    /*
     * Release deposit to creator and send unused funds to fundsRecoveryAddress.
     * requires quests to have expired
     */
    function recoverFundsAndDeposit() external {
        require(block.timestamp > expireTime, "ERROR: Not expired");

        // Restore deposit if not already released
        if (!isDepositReleased) {
            deposit.releaseTo(questCreator);
            isDepositReleased = true;
        }

        rewardToken.safeTransfer(
            fundsRecoveryAddress,
            rewardToken.balanceOf(address(this))
        );
    }

    /*
     * Claim a quest reward.
     * @param _evidence Evidence of the claim.
     * @param _player Player address.
     * @param _amount Amount of the reward.
     * requires sender to be aragonGovernAddress
     * requires evidence to not be empty
     * requires claim amount to not exceed available deposit when same token
     * emit QuestClaimed
     */
    function claim(
        bytes memory _evidence,
        address _player,
        uint256 _amount,
        bool _claimAll
    ) external {
        require(msg.sender == aragonGovernAddress, "ERROR: Sender not govern");
        require(_evidence.length != 0, "ERROR: No evidence");
        uint256 balance = rewardToken.balanceOf(address(this));

        if (_claimAll) {
            // Claim all but let deposit if they are same token
            if (address(rewardToken) == address(deposit.token)) {
                (, uint256 result) = balance.trySub(deposit.amount);
                _amount = result;
            } else {
                _amount = balance;
            }
        }

        if (address(rewardToken) == address(deposit.token)) {
            (, uint256 result) = balance.trySub(_amount);
            require(
                result >= deposit.amount,
                "ERROR: Should not exceed allowed bounty"
            );
        }

        if (_amount > 0) {
            rewardToken.safeTransfer(_player, _amount);
        }

        claims.push(Models.Claim(_evidence, _player, _amount));

        emit QuestClaimed(_evidence, _player, _amount);
    }
}
