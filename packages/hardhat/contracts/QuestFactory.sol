// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract QuestFactory {
    event QuestCreated(address questAddress, string _content);
    address public aragonGovernAddress;

    constructor() {
        aragonGovernAddress = address(0x123);
    }

    function createQuest(string calldata _content,uint256 _terminationDate, address _fallbackAddress) external {
        Quest quest = new Quest(_content,_terminationDate,aragonGovernAddress,_fallbackAddress);
        emit QuestCreated(address(quest), _content);
    }
}

contract Quest { 
    event QuestClaimed(bytes file,address player,uint256 amount); 

    struct Claim {
        bytes file;
        address player;
        uint256 amount;
    }

    Claim[] public claims;
    string public userFiles;
    string public content;
    address public aragonGovernAddress;
    address public fallbackAddress;
    uint256 public terminationDate;
    IERC20 public token;

    constructor(string memory _content,uint256 _terminationDate,address _aragonGovernAddress, address _fallbackAddress) {
        content = _content;
        terminationDate = _terminationDate;
        aragonGovernAddress = _aragonGovernAddress;
        fallbackAddress = _fallbackAddress;
    }

    function returnFunds() external{
        require(terminationDate < block.timestamp, "Quest is not expired yet.");  
        token.transfer(fallbackAddress, token.totalSupply());
    }

    function recoverNativeTokens() external {
        token.transfer(fallbackAddress, token.totalSupply());
    }

    function claim(
        bytes memory file,
        address player,
        uint256 amount) external {
        require(msg.sender == aragonGovernAddress, "Error: sender not govern");    
        require(bytes(file).length != 0, "You must join a file");  

        if(amount > 0){
            require(token.transfer(player, amount), "Could not send tokens to the buyer");
        }else if(amount == 0) {
            require(token.transfer(player, token.balanceOf(address(this))), "Could not send tokens to the buyer");
        }

        claims.push(Claim(file, player, amount));

        emit QuestClaimed(file, player, amount);
        //Send to the aragon quest stack
    }
}
