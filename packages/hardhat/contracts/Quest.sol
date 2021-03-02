// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

contract Quest {
    
    enum QuestState{Available,Pending_Verification,Verified,Disputed}
    mapping (address => string) private userFiles;
    struct Funder  {
        address payable account;
        uint amount;
        
    }

    QuestState state;
    uint colateral;
    uint256 end_time;
    
    address payable owner;
    address payable player;
    string  content;
    
    Funder [] funders;
    modifier _ownerOnly(){
      require(msg.sender == owner);
      _;
    }
    
    constructor (string memory ipfs_address, uint _colateral, uint256 _end_time) payable{
        state = QuestState.Available;
        content = ipfs_address;
        owner = msg.sender;
        colateral = _colateral;
        end_time = _end_time;
    }
    
    function addFunder() external payable {
        require(state == QuestState.Available,"this quest is not available anymore");
        require(msg.value > 0, "Insufficient funds");
        funders.push(Funder(msg.sender,msg.value));
    }
    
    //STANDBY - Talk with Will
    function claim(string memory file) public payable  {
        require(state == QuestState.Available,"this quest is not available anymore");
        require (msg.value == colateral, "Value must be equal to the colateral amount");
        require( bytes(file).length != 0,"You must join a file");
        player = msg.sender;
        userFiles[msg.sender] = file;
        state = QuestState.Pending_Verification;
    }
    
    function resolve() public payable _ownerOnly {
        require(state == QuestState.Verified);
        player.transfer(address(this).balance);

    }
    
    function validate_quest(bool valide) public _ownerOnly {
        if(valide){
            state = QuestState.Verified;
        } else {
            state = QuestState.Disputed;
        }
    }
    
    function getReward() public view returns (uint){
        //Amount in ETHER
        return address(this).balance / 1000000000000000000;
    }
    
    function get_content() public view returns (string memory) {
        return content;
    }
    
    function is_valid() public {
        if (block.timestamp > end_time){
            destroy();
        }
    }
    
    function release () private {
         for(uint i=0; i<funders.length; i++){
            (funders[i].account).transfer(funders[i].amount);
        }
    }
    
    function destroy() private {
        release ();
        selfdestruct(owner);
    }
}