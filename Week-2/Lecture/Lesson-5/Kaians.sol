// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Kaians is ERC20, ERC20Burnable, Ownable {

    uint constant public AMOUNT = 2 ether;

    constructor(address initialOwner)
        ERC20("Kaians", "KS")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public payable {
        require(msg.value == AMOUNT, "Kaians: Send sufficient amount");
        _mint(to, amount);
    }

    function withdraw() public onlyOwner {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Kaians: Failed to withdraw");
    }
    // 0x7a07B0dDd6E39866CCF0E0C8603A4C10E69E3584 
}
