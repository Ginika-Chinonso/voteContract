// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract voteContract is ERC20{

    address public owner;
    address public Admin;
    bool public votingOngoing;
    uint public price = 1 gwei;

    
    address[3] contenders;

    mapping(address => bool) public isContender;
    mapping(address => bool) public hasVoted;
    mapping(address => uint) public contenderPoint;


    struct ContenderResult {
        address _contender;
        uint _point;
    }

    ContenderResult[] Result;

    constructor(string memory name_, string memory symbol_, uint _amount) ERC20(name_, symbol_){
        Admin = msg.sender;
        owner = address(this);

        _mint(Admin, _amount);
    }


    modifier onlyOwner{
        require(msg.sender == owner || msg.sender == Admin, "Only owner can call this function");
        _;
    }


    function registerContenders(address[3] memory _contenders) public onlyOwner{
        require(_contenders.length == 3, "Contenders not up to 3");
        contenders = _contenders;
        for (uint i = 0; i < _contenders.length; i++){
            isContender[_contenders[i]] = true;
        }
    }

    function getContenders() public view returns(address[3] memory _contenders){
        _contenders = contenders;
    }

    function vote (address[] memory _contenders) public {
        require(votingOngoing, "Voting has ended");
        require(_contenders[0] != _contenders[1] && _contenders[0] != _contenders[2] && _contenders[1] != _contenders[2], "Cant pass in same address twice");
        require(isContender[msg.sender] == false, "You cant vote for yourself");
        require(hasVoted[msg.sender] == false, "You have already voted");
        require(balanceOf(msg.sender) >= 6, "You do not have enough tokens to vote");
        require(_contenders.length == 3, "Contenders not up to 3");
        for (uint i = 0; i < _contenders.length; i++){
            require(isContender[_contenders[i]], "Please confirm your contenders");
        }
        
        uint _amount = 3;
        for (uint i = 0; i < _contenders.length; i++){
            _transfer(msg.sender, address(this), _amount);
            contenderPoint[_contenders[i]] += _amount;
            _amount -= 1;
        }


        hasVoted[msg.sender] = true;
        
    }


    function voteResult() public returns(ContenderResult[] memory _result){

        if (Result.length >= 3){
            Result.pop();
            Result.pop();
            Result.pop();
        }

        for (uint i = 0; i < contenders.length; i++){
            ContenderResult memory _con = ContenderResult({
                _contender: contenders[i],
                _point: contenderPoint[contenders[i]]
            });
            Result.push(_con);
        }
        _result = Result;
    }

    function winner() public view returns(ContenderResult memory _winner) {
        _winner;
        uint _point;
        for (uint i = 0; i < contenders.length; i++) {
            if (contenderPoint[contenders[i]] > _point){
                _winner._contender = contenders[i];
                _winner._point = contenderPoint[contenders[i]];
                _point = contenderPoint[contenders[i]];
            }
        }
    }

    function startVoting() public onlyOwner{
        votingOngoing = true;
    }

    function endVoting() public onlyOwner{
        votingOngoing = false;
    }

    function buyToken() public payable{
        uint tokenEquivalent = msg.value / price;
        _mint(msg.sender, tokenEquivalent);
    }

    function burntoken(uint _amount) public onlyOwner {
        require(balanceOf(address(this)) >= _amount, "You can burn more than is availiable");
        _burn(address(this), _amount);
    }

    receive() external payable{}

    fallback() external payable{}
}