// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract QuestGold is ERC20 {
    constructor(uint256 initialSupply) ERC20("QuestGold", "QGLD") {
        _mint(msg.sender, initialSupply);
    }
}

contract QuestFactory {
    event QuestCreated(address questAddress, string _content);

    function createQuest(string calldata _content,uint256 _terminationDate,address payable _aragonGovernAddress, address payable _fallbackAddress, uint256 _nbToken) external {
        Quest quest = new Quest(_content,_terminationDate,_aragonGovernAddress,_fallbackAddress, _nbToken);
        emit QuestCreated(address(quest), _content);
    }
}

contract Quest {
    string private userFiles;
    string public content;
    address payable private aragonGovernAddress;
    address payable private fallbackAddress;
    uint256 public terminationDate;
    QuestGold private token;

    constructor(string memory _content,uint256 _terminationDate,address payable _aragonGovernAddress, address payable _fallbackAddress, uint256 _nbToken) public {
        content = _content;
        terminationDate = _terminationDate;
        aragonGovernAddress = _aragonGovernAddress;
        fallbackAddress = _fallbackAddress;
        token = new QuestGold(_nbToken);
    }

    function returnFunds() external payable{
        require(terminationDate < block.timestamp, "Quest is not expired yet.");  
        fallbackAddress.transfer(address(this).balance);
    }

    function claim(
        string calldata file,
        address payable player,
        uint256 amount) external payable {
        require(msg.sender == aragonGovernAddress, "Error: sender not govern");    
        require(bytes(file).length != 0, "You must join a file");  

        if(amount > 0){
            require(token.transferFrom(address(this), player, amount) == true, "Could not send tokens to the buyer");
            player.transfer(amount);
        }else if(amount == 0) {
            require(token.transferFrom(address(this), player, token.totalSupply()) == true, "Could not send tokens to the buyer");
            player.transfer(address(this).balance);
        }

        userFiles = file;
        //Send to the aragon quest stack
    }
}
