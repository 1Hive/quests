// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

contract Quest {
    
    enum QuestState{Available,Claimed,Disputed,Resolved}
    mapping (address => string) public userFiles;
    
    struct Funder  {
        address account;
        uint amount;
        
    }

    QuestState state;
    
    string name;
    string description;
    address owner;
    uint colateral;
    
    Funder [] funders;

    
    constructor (string  memory  _name,string memory _description, uint _colateral) payable{
        state = QuestState.Available;
        name = _name;
        description = _description;
        owner = msg.sender;
        colateral = _colateral;
    }
    
    function addFunder() public payable{
        require(msg.value > 0, "Insufficient funds");
        funders.push(Funder(msg.sender,msg.value));
    }
    
    //STANDBY - Talk with Will
    function claim(string memory file) external payable  {
        require (msg.value == colateral, "Value must be equal to the colateral amount");
        userFiles[msg.sender] = file;
        state = QuestState.Claimed;
    }
    
    modifier _ownerOnly(){
      require(msg.sender == owner);
      _;
    }
    
    function resolve(address payable _account, uint _amount) public payable _ownerOnly {
        _account.transfer(_amount);
        state = QuestState.Resolved;
    }
    
    function getReward() public view returns (uint){
        //Amount in ETHER
        return address(this).balance / 1000000000000000000;
    }
}