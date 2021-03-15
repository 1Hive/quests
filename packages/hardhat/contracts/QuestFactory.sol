
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

contract QuestFactory {
    Quest[] public quests;
    uint256 disabledCount;

    event QuestCreated(address questAddress, string _content);

    function createQuest(string calldata _content) external {
        Quest quest = new Quest(_content, quests.length);
        quests.push(quest);
        emit QuestCreated(address(quest), _content);
    }

    function getQuests() external view returns (Quest[] memory _quests) {
        _quests = new Quest[](quests.length - disabledCount);
        uint256 count;
        for (uint256 i = 0; i < quests.length; i++) {
            if (quests[i].isEnabled()) {
                _quests[count] = quests[i];
                count++;
            }
        }
    }

    function disable(Quest quest) external {
        quests[quest.index()].disable();
        disabledCount++;
    }
}

contract Quest {
    string private userFiles;
    string public content;
    bool public isEnabled;
    uint256 public index;
    address public owner;

    constructor(string memory _content, uint256 _index) public {
        content = _content;
        isEnabled = true;
        index = _index;
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

    function disable() external {
        isEnabled = false;
    }
}