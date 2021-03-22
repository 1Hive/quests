// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

contract QuestFactory {
    event QuestCreated(address questAddress, string _content);

    function createQuest(string calldata _content,uint256 _terminationDate) external {
        Quest quest = new Quest(_content,_terminationDate);
        emit QuestCreated(address(quest), _content);
    }

}

contract Quest {
    string private userFiles;
    string public content;
    address payable private aragonGovernAddress;
    uint256 public terminationDate;

    constructor(string memory _content,uint256 _terminationDate) public {
        content = _content;
        terminationDate = _terminationDate;
    }

    function claim(
        address payable player,
        uint256 amount,
        string calldata file
    ) external payable {
        require(bytes(file).length != 0, "You must join a file");
        require(msg.sender == aragonGovernAddress, "Error: sender not govern");

        if(terminationDate < block.timestamp){
            aragonGovernAddress.transfer(address(this).balance);
        } else {
            userFiles = file;
            player.transfer(amount);
        }
    }

}
