// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Register {
    // primitive data types

    int public signedNumber = -10;
    uint public count = 10;
    bool private isActive = false;
    address public ownerAddress;
    bytes public rawData = "Gkaia! Kaia Developers";
    
    enum Phase { Init, Learning, Completed }
    Phase public currentPhase = Phase.Init;
    event SetClassEvent (string name, uint indexed numOfStudent, uint indexed year);
    
    // Reference types
    
    // 1. Struct
    struct Class {
        string name;
        uint numberOfStudents;
        uint year;
    }
    
    // Instance of struct
    Class public class;
    
    // 2. Arrays
    Class[] public classes;
    address[] public authorizedUsers;
    
    // 3. Mappings
    mapping(address => bool) public isAuthorized;
    mapping(string => Class) public classByName;
    
    constructor() {
        ownerAddress = msg.sender;
        isAuthorized[msg.sender] = true;
        authorizedUsers.push(msg.sender);
    }
    
    // Basic functions from simple contract

    function changePhase(Phase _newPhase) public {
        currentPhase = _newPhase;
    }
    
    function toggleActive() public {
        isActive = !isActive;
    }
    
    // register function using struct, arrays, and mappings

    function setClass(string memory _name, uint _numOfStudents, uint _year) public {
        // Create a new Class struct
        Class memory newClass = Class(_name, _numOfStudents, _year);
        
        // Set the main class
        class = newClass;
        
        // Add to the mapping
        classByName[_name] = newClass;
        
        // Add to the array
        classes.push(newClass);

        emit SetClassEvent(_name, _numOfStudents, _year);
    }   
}