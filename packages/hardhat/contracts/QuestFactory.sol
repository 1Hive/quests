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
    Models.Deposit public createDeposit;
    Models.Deposit public playDeposit;

    event QuestCreated(
        address questAddress,
        string questTitle,
        bytes questDetailsRef,
        address rewardTokenAddress,
        uint256 expireTime,
        address fundsRecoveryAddress,
        address createDepositToken,
        uint256 createDepositAmount,
        address playDepositToken,
        uint256 playDepositAmount,
        address creator,
        uint32 maxPlayers
    );

    event CreateDepositChanged(
        uint256 timestamp,
        address token,
        uint256 amount
    );

    event PlayDepositChanged(uint256 timestamp, address token, uint256 amount);

    constructor(
        address _aragonGovernAddress,
        IERC20 _createDepositToken,
        uint256 _createDepositAmount,
        IERC20 _playDepositToken,
        uint256 _playDepositAmount,
        address _initialOwner
    ) {
        aragonGovernAddress = _aragonGovernAddress;
        setCreateDeposit(_createDepositToken, _createDepositAmount);
        setPlayDeposit(_playDepositToken, _playDepositAmount);
        if (_initialOwner != msg.sender) {
            transferOwnership(_initialOwner);
        }
    }

    /*
     * @dev Set the deposit token and amount.
     * @param _depositToken The deposit token.
     * @param _depositAmount The deposit amount.
     * emit CreateDepositChanged
     */
    function setCreateDeposit(IERC20 token, uint256 amount) public onlyOwner {
        createDeposit = Models.Deposit(token, amount);
        emit CreateDepositChanged(block.timestamp, address(token), amount);
    }

    /*
     * @dev Set the play deposit token and amount.
     * @param _depositToken The deposit token.
     * @param _depositAmount The deposit amount.
     * emit PlayDepositChanged
     */
    function setPlayDeposit(IERC20 token, uint256 amount) public onlyOwner {
        playDeposit = Models.Deposit(token, amount);
        emit PlayDepositChanged(block.timestamp, address(token), amount);
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
        address payable _fundsRecoveryAddress,
        uint32 _maxPlayers
    ) external returns (address) {
        Quest quest = new Quest(
            _questTitle,
            _questDetailsRef,
            _rewardToken,
            _expireTime,
            aragonGovernAddress,
            _fundsRecoveryAddress,
            Models.Deposit(createDeposit.token, createDeposit.amount),
            Models.Deposit(playDeposit.token, playDeposit.amount),
            msg.sender,
            _maxPlayers
        );

        // Collect deposit from quest creator and send it to quest
        createDeposit.collectFrom(msg.sender, address(quest));

        emit QuestCreated(
            address(quest),
            _questTitle,
            _questDetailsRef,
            address(_rewardToken),
            _expireTime,
            _fundsRecoveryAddress,
            address(createDeposit.token),
            createDeposit.amount,
            address(playDeposit.token),
            playDeposit.amount,
            msg.sender,
            _maxPlayers
        );

        return address(quest);
    }
}
