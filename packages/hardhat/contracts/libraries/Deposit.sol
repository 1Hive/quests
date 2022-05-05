// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Models.sol";

library DepositLib {
    using SafeERC20 for IERC20;

    /*
     * Collect deposit from signer and send it to _to address.
     * @param _token The deposit token.
     * @param _amount The deposit amount.
     * @param _to The address where the deposit should be transfered.
     */
    function collectFrom(
        Models.Deposit memory _collateral,
        address _from,
        address _to
    ) internal {
        collectFrom(_collateral, _from);
        releaseTo(_collateral, _to);
    }

    /*
     * Collect deposit from signer
     * @param _token The deposit token.
     * @param _amount The deposit amount.
     */
    function collectFrom(Models.Deposit memory _collateral, address _from)
        internal
    {
        if (_collateral.amount > 0) {
            // Verify allowance
            uint256 allowance = _collateral.token.allowance(
                _from,
                address(this)
            );
            require(
                allowance >= _collateral.amount,
                "ERROR : Deposit bad allowance"
            );

            _collateral.token.safeTransferFrom(
                _from,
                address(this),
                _collateral.amount
            );
        }
    }

    function releaseTo(Models.Deposit memory _collateral, address _to)
        internal
    {
        if (_collateral.amount > 0) {
            _collateral.token.safeTransfer(_to, _collateral.amount);
        }
    }
}
