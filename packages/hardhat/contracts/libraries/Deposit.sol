// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Models.sol";

library DepositLib {
    using SafeERC20 for IERC20;

    event Lock(address indexed token, address indexed from, uint256 amount);
    event Unlock(address indexed token, address indexed to, uint256 amount);

    function collectFrom(Models.Deposit memory _collateral, address _from)
        internal
    {
        if (_collateral.amount > 0) {
            IERC20 token = IERC20(_collateral.token);
            token.safeTransferFrom(_from, address(this), _collateral.amount);
            emit Lock(address(_collateral.token), _from, _collateral.amount);
        }
    }

    function releaseTo(Models.Deposit memory _collateral, address _to)
        internal
    {
        if (_collateral.amount > 0) {
            IERC20 token = IERC20(_collateral.token);
            token.safeTransfer(_to, _collateral.amount);
            emit Unlock(address(_collateral.token), _to, _collateral.amount);
        }
    }
}
