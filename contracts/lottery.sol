pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] private _players;
    
    constructor() public{
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value >=  0.1 ether);
        _players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, _players));
    }

    function pickWinner() public managerOnly {
        uint index = random() % _players.length;
        _players[index].transfer(this.balance);
        _players = new address[](0);
    }

    modifier managerOnly() {
        require(msg.sender == manager);
        _; // 後面的程式邏輯
    }

    function getPlayers() public view returns(address[]) {
        return _players;
    }
}