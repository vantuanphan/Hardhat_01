//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// Xay dung SmartContract
contract Token {
    string public name = "My Hardhat Token";
    string public symbol = "MHT";

    // Tao so luong token co dinh
    uint256 public totalSupply = 1000000;

    // Dia chi luu tru tai khoan ethereum
    address public owner;

    // Mapping luu tru so du cua tung tai khoan
    mapping(address => uint256) balances;

    // Tao su kien ten Transfer doi chuyen doi tien
    event Transfer(address indexed _from, address indexed _to, uint256 _value);


    constructor() {
        // totaSupply duoc gan cho ng gui giao dich
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    // Tao ham chuyen token va external de chi duoc goi tu ben ngoai
    function transfer(address to, uint256 amount) external {

        // Kiem tra ng gui co du token khong?
        require(balances[msg.sender] >= amount, "Not enough tokens");
        // Hien thi thong tin minh muon xem
        console.log(
        "Transferring from %s to %s %s tokens",
        msg.sender,
        to,
        amount
    );

        // Chuyen tien
        balances[msg.sender] -= amount;
        balances[to] += amount;

        // Thong bao ra ben ngoai
        emit Transfer(msg.sender, to, amount);
    }

    // Hien thi so du cua mot tai khoan nhat dinh
    // view chi doc va k the sua doi contract
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}