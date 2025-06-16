// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/Counter.sol";

contract DeployScript is Script {
    function run() external {
        // Load environment variables
        string memory rpcUrl = vm.envString("KAIROS_RPC_URL");
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0));

        // Start broadcasting transactions
        if (deployerPrivateKey != 0) {
            vm.startBroadcast(deployerPrivateKey);
        } else {
            // Use hardware wallet
            vm.startBroadcast();
        }

        // Deploy your contract
        Counter counter = new Counter();

        // Stop broadcasting
        vm.stopBroadcast();

        // Log the deployed address and RPC URL
        console.log("Contract deployed at:", address(counter));
        console.log("RPC URL:", rpcUrl);
    }
}
