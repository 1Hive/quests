// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Quest {
  using SafeERC20 for IERC20;

  struct Claim {
    bytes evidence;
    address player;
    uint256 amount;
  }

  bytes public requirements;
  IERC20 public rewardToken;
  uint256 public expireTime;
  address public aragonGovernAddress;
  address payable public fundsRecoveryAddress;
  Claim[] public claims;

  event QuestClaimed(bytes evidence, address player, uint256 amount);

  constructor(
    bytes memory _requirements,
    IERC20 _rewardToken,
    uint256 _expireTime,
    address _aragonGovernAddress,
    address payable _fundsRecoveryAddress
  ) {
    requirements = _requirements;
    rewardToken = _rewardToken;
    expireTime = _expireTime;
    aragonGovernAddress = _aragonGovernAddress;
    fundsRecoveryAddress = _fundsRecoveryAddress;
  }

  function recoverUnclaimedFunds() external {
    require(block.timestamp > expireTime, "ERROR: Not expired");
    rewardToken.safeTransfer(
      fundsRecoveryAddress,
      rewardToken.balanceOf(address(this))
    );
  }

  function recoverNativeTokens() external {
    fundsRecoveryAddress.transfer(address(this).balance);
  }

  function claim(
    bytes memory _evidence,
    address _player,
    uint256 _amount
  ) external {
    require(msg.sender == aragonGovernAddress, "ERROR: Sender not govern");
    require(_evidence.length != 0, "ERROR: No evidence");

    if (_amount > 0) {
      rewardToken.safeTransfer(_player, _amount);
    } else if (_amount == 0) {
      rewardToken.safeTransfer(_player, rewardToken.balanceOf(address(this)));
    }

    claims.push(Claim(_evidence, _player, _amount));

    emit QuestClaimed(_evidence, _player, _amount);
  }
}
