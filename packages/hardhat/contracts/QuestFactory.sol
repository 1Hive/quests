// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract ERC20Basic is IERC20 {

    string public constant name = "ERC20Basic";
    string public constant symbol = "ERC";
    uint8 public constant decimals = 18;

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    uint256 totalSupply_ = 10 ether;

    using SafeMath for uint256;

    constructor() public {
        balances[msg.sender] = totalSupply_;
    }

    function totalSupply() public override view returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        return true;
    }

    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
     
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}

contract QuestFactory {
    event QuestCreated(address questAddress, string _content);

    function createQuest(string calldata _content,uint256 _terminationDate,address payable _aragonGovernAddress, address payable _fallbackAddress) external {
        Quest quest = new Quest(_content,_terminationDate,_aragonGovernAddress,_fallbackAddress);
        emit QuestCreated(address(quest), _content);
    }
}

contract Quest {
    string private userFiles;
    string public content;
    address payable private aragonGovernAddress;
    address payable private fallbackAddress;
    uint256 public terminationDate;
    IERC20 public token;


    constructor(string memory _content,uint256 _terminationDate,address payable _aragonGovernAddress, address payable _fallbackAddress) public {
        content = _content;
        terminationDate = _terminationDate;
        aragonGovernAddress = _aragonGovernAddress;
        fallbackAddress = _fallbackAddress;
        token = new ERC20Basic();
    }

    function claimFunds(
        uint256 amount,
        string calldata file) external payable {
        if(terminationDate < block.timestamp){
            fallbackAddress.transfer(address(this).balance);
        } else {
            require(bytes(file).length != 0, "You must join a file");
            userFiles = file;
            //Send to the aragon quest stack
        }
    }


    function claim(
        address payable player,
        uint256 amount) external payable {
        require(msg.sender == aragonGovernAddress, "Error: sender not govern");    
        if(amount > 0){
            require(token.transferFrom(address(this), player, amount) == true, "Could not send tokens to the buyer");
            player.transfer(amount);
        }else if(amount == 0) {
            require(token.transferFrom(address(this), player, token.totalSupply()) == true, "Could not send tokens to the buyer");
            player.transfer(address(this).balance);
        }
    }
}
