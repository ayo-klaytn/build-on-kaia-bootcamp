import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-ledger"

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        kairos: {
            url:
                process.env.KAIROS_RPC_URL ||
                "https://public-en-kairos.node.kaia.io",
            chainId: 1001,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            // If you want to use Ledger, uncomment this and comment out the accounts above
            ledgerAccounts: [
                // This is an example address
                // Be sure to replace it with an address from your own Ledger device
                "0xa809931e3b38059adae9bc5455bc567d0509ab92"
            ]
        },
        hardhat: {
            // If you want to do some forking, uncomment this
            // forking: {
            //     url: process.env.KAIA_MAINNET_RPC_URL || "",
            // If you don't want to set the block number, you can remove the blockNumber property
            //     blockNumber: 18_000_000
            // }
        },
        localhost: {
            url: "http://127.0.0.1:8545"
        }
    },
    etherscan: {
        // Your API key for KaiaScan
        // Obtain one at https://kaiascan.io/
        apiKey: {
            kairos: process.env.KAIA_SCAN_API_KEY || ""
        }
    },
    solidity: {
        version: "0.8.28",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
}

export default config
