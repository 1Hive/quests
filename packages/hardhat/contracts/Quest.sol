// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./libraries_Deposit.sol";
import "./libraries_Models.sol";
import "./libraries_IExecutable.sol";

contract Quest is IExecutable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using DepositLib for Models.Deposit;

    // Quest payload
    address public questCreator;
    string public questTitle;
    bytes public questDetailsRef;
    IERC20 public rewardToken;
    uint256 public expireTime;
    address public aragonGovernAddress;
    address payable public fundsRecoveryAddress;
    uint32 public maxPlayers; // 0 for unlimited players

    Models.Claim[] public claims;
    Models.Deposit public createDeposit;
    Models.Deposit public playDeposit;
    bool public isCreateDepositReleased;

    address[] private playerList;

    event QuestClaimed(bytes evidence, address player, uint256 amount);
    event QuestPlayed(address player, uint256 timestamp);
    event QuestUnplayed(address player, uint256 timestamp);

    constructor(
        string memory _questTitle,
        bytes memory _questDetailsRef,
        IERC20 _rewardToken,
        uint256 _expireTime,
        address _aragonGovernAddress,
        address payable _fundsRecoveryAddress,
        Models.Deposit memory _createDeposit,
        Models.Deposit memory _playDeposit,
        address _questCreator,
        uint32 _maxPlayers
    ) {
        questTitle = _questTitle;
        questDetailsRef = _questDetailsRef;
        rewardToken = _rewardToken;
        expireTime = _expireTime;
        aragonGovernAddress = _aragonGovernAddress;
        fundsRecoveryAddress = _fundsRecoveryAddress;
        questCreator = _questCreator;
        createDeposit = _createDeposit;
        playDeposit = _playDeposit;

        isCreateDepositReleased = false;
        maxPlayers = _maxPlayers;
    }

    /*
     * Claim a quest reward.
     *
     * @param _evidence Evidence of the claim.
     * @param _player Player address.
     * @param _amount Amount of the reward.
     *
     * requires sender to be aragonGovernAddress
     * requires evidence to not be empty
     * requires claim amount to not exceed available deposit when same token
     *
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
            // Claim all but let the create deposit if they are same token
            if (address(rewardToken) == address(createDeposit.token)) {
                (, uint256 result) = balance.trySub(createDeposit.amount);
                _amount = result;
            } else {
                _amount = balance;
            }
            // Claim all but let play deposits of each player if they are same token
            if (address(rewardToken) == address(playDeposit.token)) {
                (, uint256 result) = _amount.trySub(
                    playDeposit.amount * playerList.length
                );
                _amount = result;
            }
        }

        if (address(rewardToken) == address(createDeposit.token)) {
            (, uint256 result) = balance.trySub(_amount);
            require(
                result >= createDeposit.amount,
                "ERROR: Should not exceed allowed bounty"
            );
        }

        if (_amount > 0) {
            rewardToken.safeTransfer(_player, _amount);
        }

        claims.push(Models.Claim(_evidence, _player, _amount));

        emit QuestClaimed(_evidence, _player, _amount);
    }

    /*
     * Release create deposit to creator and send unused funds to fundsRecoveryAddress.
     * requires quests to have expired
     *
     * requires quest to be expired
     */
    function recoverFundsAndDeposit() external {
        require(block.timestamp >= expireTime, "ERROR: Not expired");

        // Restore deposit if not already released
        if (!isCreateDepositReleased) {
            createDeposit.releaseTo(questCreator);
            isCreateDepositReleased = true;
        }

        uint256 balance = rewardToken.balanceOf(address(this));

        // Claim all but let the create deposit if they are same token
        if (address(rewardToken) == address(playDeposit.token)) {
            (, balance) = balance.trySub(
                playDeposit.amount * playerList.length
            );
        }

        rewardToken.safeTransfer(fundsRecoveryAddress, balance);
    }

    /**
     * Verify given executer can execute this quest.
     * @param executer The player to verify
     */
    function canExecute(
        address executer
    ) external view override returns (bool) {
        return findIndexOfPlayer(executer) != -1;
    }

    /**
     * Register a player to the quest. (sender could be the player or quest creator)
     *
     * @param _player Player address.
     *
     * requires sender to be the quest creator or the player
     * requires sender to put a deposit (if its creator, deposit will be released to player)
     * requires player list is not full
     * requires quest is not expired
     * requires player is not already registered
     *
     * emit QuestPlayed with player and timestamp
     */
    function play(address _player) external {
        require(
            msg.sender == _player || msg.sender == questCreator,
            "ERROR: Sender not player nor creator"
        );
        require(
            maxPlayers == 0 || playerList.length < maxPlayers,
            "ERROR: Max players reached"
        );
        require(block.timestamp < expireTime, "ERROR: Quest expired");
        int256 playerIndex = findIndexOfPlayer(_player);
        require(playerIndex == -1, "ERROR: Player already exists");

        playDeposit.collectFrom(msg.sender, address(this));

        playerList.push(_player);
        emit QuestPlayed(_player, block.timestamp);
    }

    /**
     * Unregister a player from the quest. (sender could be the player or quest creator)
     * @param _player Player address.
     *
     * requires sender to be the quest creator or the player
     * requires player is registered
     *
     * emit QuestUnplayed with player and timestamp
     */
    function unplay(address _player) external {
        require(
            msg.sender == _player || msg.sender == questCreator,
            "ERROR: Sender not player nor creator"
        );
        int256 playerIndex = findIndexOfPlayer(_player);
        require(playerIndex != -1, "ERROR: player not in list");

        // We put the last player in the place of the player to remove
        playerList[uint256(playerIndex)] = playerList[playerList.length - 1];
        // And then we can remove the last element to have the actual lenght updated
        playerList.pop();

        playDeposit.releaseTo(_player);
        emit QuestUnplayed(_player, block.timestamp);
    }

    /**
      Simply return the player list as the entire array
    */
    function getPlayers() external view returns (address[] memory) {
        return playerList;
    }

    // Private functions

    function findIndexOfPlayer(address _player) private view returns (int256) {
        for (uint256 i = 0; i < playerList.length; i++) {
            if (playerList[i] == _player) {
                return int256(i);
            }
        }
        return -1;
    }
}
