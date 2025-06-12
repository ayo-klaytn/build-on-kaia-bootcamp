// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


contract CastleMap is Ownable {
    error CallerIsNotOwner();

    address[] private treasuryCastles;
    address[] private gemCastles;
    address[] private banditForts;

    constructor(address initialOwner) Ownable(initialOwner) { }


    function addTreasuryCastle(address newCastle) public onlyOwner returns (address) {
        treasuryCastles.push(newCastle);
        return newCastle;
    }

    function addGemCastle(address newCastle) public onlyOwner returns (address) {
        gemCastles.push(newCastle);
        return newCastle;
    }

    function addBanditFort(address newBanditFort) public onlyOwner returns (address) {
        banditForts.push(newBanditFort);
        return newBanditFort;
    }

    function removeTreasuryCastle(address castle) public onlyOwner {
        for (uint256 i = 0; i < treasuryCastles.length; i++) {
            if (treasuryCastles[i] == castle) {
                treasuryCastles[i] = treasuryCastles[treasuryCastles.length - 1];
                treasuryCastles.pop();
                break;
            }
        }
    }

    function removeGemCastle(address castle) public onlyOwner {
        for (uint256 i = 0; i < gemCastles.length; i++) {
            if (gemCastles[i] == castle) {
                gemCastles[i] = gemCastles[gemCastles.length - 1];
                gemCastles.pop();
                break;
            }
        }
    }

    function removeBanditFort(address banditFort) public onlyOwner {
        for (uint256 i = 0; i < banditForts.length; i++) {
            if (banditForts[i] == banditFort) {
                banditForts[i] = banditForts[banditForts.length - 1];
                banditForts.pop();
                break;
            }
        }
    }

    function getAllTreasuryCastles() public view returns (address[] memory) {
        return treasuryCastles;
    }

    function getAllGemCastles() public view returns (address[] memory) {
        return gemCastles;
    }

    function getAllBanditForts() public view returns (address[] memory) {
        return banditForts;
    }

    function purgeAllTreasuryCastles() public onlyOwner {
        treasuryCastles = new address[](0);
    }

    function purgeAllGemCastles() public onlyOwner {
        gemCastles = new address[](0);
    }

    function purgeAllBanditForts() public onlyOwner {
        banditForts = new address[](0);
    }
}

// 0x9c0359a5c06da445b6d89094a1d9785cda518ef6