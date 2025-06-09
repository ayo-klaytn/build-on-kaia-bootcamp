
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Basic {
    // signed integers
    int public num = -10; // slot 0 

    // unsigned integers
    uint public bal = 200;  // slot 1 

    // bool
    bool public isActive = false; 

    // Address
    address public owner; 

    // enum
    enum Phase {start, ongoing, finshed}
    Phase public  defaultPhase = Phase.ongoing; 

    // bytes32
    bytes32 ownerHashValue = keccak256(abi.encode(owner));

    function changeOwner(address _newOwner) public  {
        owner = _newOwner;
    }

    function changePhase(Phase _phase) public {
        defaultPhase = _phase;
    }

    function toggleActive() public {
        isActive = !isActive;
    }

    // 0x7489671697Fd6AfA5411e9230bCa1DA2f74F9992 
}