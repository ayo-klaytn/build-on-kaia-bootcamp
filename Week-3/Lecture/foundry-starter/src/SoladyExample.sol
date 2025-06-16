// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "solady/utils/LibString.sol";
import "solady/utils/SafeTransferLib.sol";
import "solady/utils/ReentrancyGuard.sol";

contract SoladyExample is ReentrancyGuard {
    using LibString for uint256;
    using SafeTransferLib for address;

    string public name;
    uint256 public count;

    constructor(string memory _name) {
        name = _name;
    }

    // Using LibString for number to string conversion
    function getCountAsString() public view returns (string memory) {
        return count.toString();
    }

    // Using SafeTransferLib for safe ETH transfers
    function sendETH(address payable to, uint256 amount) public nonReentrant {
        SafeTransferLib.safeTransferETH(to, amount);
    }

    // Using ReentrancyGuard for security
    function increment() public nonReentrant {
        count++;
    }
}
