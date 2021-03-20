// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

contract QuestFactory {
    event QuestCreated(address questAddress, string _content);

    function createQuest(string calldata _content) external {
        // require verify aragon address
        Quest quest = new Quest(_content);
        emit QuestCreated(address(quest), _content);
    }
}

contract Quest {
    string private userFiles;
    string public content;

    constructor(string memory _content) public {
        content = _content;
    }

    function claim(
        address payable player,
        uint256 amount,
        string calldata file
    ) external payable {
        require(bytes(file).length != 0, "You must join a file");
        userFiles = file;
        player.transfer(amount);
    }
}
