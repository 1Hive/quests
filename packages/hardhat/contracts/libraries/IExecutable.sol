// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

interface IExecutable {
    function canExecute(address executer) external returns (bool);
}
