// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/Deposit.sol";
import "./libraries/Models.sol";
import "./Quest.sol";

contract QuestFactory is Ownable {
    using DepositLib for Models.Deposit;

    address public aragonGovernAddress;
    Models.Deposit public deposit;

    event QuestCreated(
        address questAddress,
        string questTitle,
        bytes questDetailsRef,
        address rewardTokenAddress,
        uint256 expireTime,
        address fundsRecoveryAddress,
        address depositToken,
        uint256 depositAmount,
        address creator
    );

    event DepositChanged(uint256 timestamp, address token, uint256 amount);

    constructor(
        address _aragonGovernAddress,
        IERC20 _depositToken,
        uint256 _depositAmount,
        address _initialOwner
    ) {
        aragonGovernAddress = _aragonGovernAddress;
        setDeposit(_depositToken, _depositAmount);
        if (_initialOwner != msg.sender) {
            transferOwnership(_initialOwner);
        }
    }

    /*
     * @dev Set the deposit token and amount.
     * @param _depositToken The deposit token.
     * @param _depositAmount The deposit amount.
     * emit DepositChanged
     */
    function setDeposit(IERC20 token, uint256 amount) public onlyOwner {
        deposit = Models.Deposit(token, amount);
        emit DepositChanged(block.timestamp, address(token), amount);
    }

    /*
     * Collect deposit, deploy a new Quest with given info contract
     * and transfer deposit to new Quest.
     * @param _title Quest title.
     * @param _details Quest details.
     * @param _rewardTokenAddress Reward token address.
     * @param _expireTime Expire time.
     * @param _fundsRecoveryAddress Funds recovery address.
     * requires deposit allowance
     * returns Quest address.
     * emits QuestCreated
     */
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
            deposit.amount,
            msg.sender
        );

        // Collect deposit from quest creator and send it to quest
        deposit.collectFrom(msg.sender, address(quest));

        emit QuestCreated(
            address(quest),
            _questTitle,
            _questDetailsRef,
            address(_rewardToken),
            _expireTime,
            _fundsRecoveryAddress,
            address(deposit.token),
            deposit.amount,
            msg.sender
        );

        return address(quest);
    }
}
