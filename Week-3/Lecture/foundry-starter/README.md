# Foundry Starter

This is a sample project for the Build on Kaia bootcamp using Foundry.

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

#### Using Hardware Wallet

Use the following flags to connect to a hardware wallet.

```shell
-t
--trezor
    Use a Trezor hardware wallet.

-l
--ledger
    Use a Ledger hardware wallet.
```

### Verify

```shell
$ forge verify-contract --chain <your_chain_id> --etherscan-api-key <your_etherscan_api_key> --constructor-args <constructor_args> <CONTRACT_ADDRESS> <CONTRACT_SOURCE_CODE>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
