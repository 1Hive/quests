// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./libraries/Deposit.sol";
import "./libraries/Models.sol";
import "./Quest.sol";

contract QuestFactory is OwnableUpgradeable {
    using DepositLib for Models.Deposit;

    address public aragonGovernAddress;
    Models.Deposit public createDeposit;
    Models.Deposit public playDeposit;
    uint256 public constant version = 3;

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
        uint32 maxPlayers,
        bool isWhiteList
    );

    event CreateDepositChanged(
        uint256 timestamp,
        address token,
        uint256 amount
    );

    event PlayDepositChanged(uint256 timestamp, address token, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _aragonGovernAddress,
        IERC20Upgradeable _createDepositToken,
        uint256 _createDepositAmount,
        IERC20Upgradeable _playDepositToken,
        uint256 _playDepositAmount,
        address _initialOwner
    ) public initializer {
        __Ownable_init();
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
    function setCreateDeposit(
        IERC20Upgradeable token,
        uint256 amount
    ) public onlyOwner {
        createDeposit = Models.Deposit(token, amount);
        emit CreateDepositChanged(block.timestamp, address(token), amount);
    }

    /*
     * @dev Set the play deposit token and amount.
     * @param _depositToken The deposit token.
     * @param _depositAmount The deposit amount.
     * emit PlayDepositChanged
     */
    function setPlayDeposit(
        IERC20Upgradeable token,
        uint256 amount
    ) public onlyOwner {
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
        IERC20Upgradeable _rewardToken,
        uint256 _expireTime,
        address payable _fundsRecoveryAddress,
        uint32 _maxPlayers,
        bool _isWhiteList
    ) external returns (address) {
        Quest quest = new Quest(
            _questTitle,
            _questDetailsRef,
            Models.Deposit(createDeposit.token, createDeposit.amount),
            Models.Deposit(playDeposit.token, playDeposit.amount),
            Models.QuestParam(
                msg.sender,
                _maxPlayers,
                _rewardToken,
                _expireTime,
                aragonGovernAddress,
                _fundsRecoveryAddress,
                _isWhiteList
            )
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
            _maxPlayers,
            _isWhiteList
        );

        return address(quest);
    }

    /**
     * @dev Be able to change it after deploy so we can deploy
     * a new GovernQueue but keep the same QuestFactory
     * @param _aragonGovernAddress The aragonGovernAddress.
     */
    function setAragonGovernAddress(
        address _aragonGovernAddress
    ) external onlyOwner {
        aragonGovernAddress = _aragonGovernAddress;
    }
}
