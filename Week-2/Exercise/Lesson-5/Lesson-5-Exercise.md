# RaidTreasury 
This is an interactive exercise to learn, understand tokens, and how to interact with token contract. 

# Your Mission:

A vulnerable contract called [RaidTreasury](./RaidTreasury.sol) is guarding 20 GOLD tokens — your task is to make it yours. Use your wit, read the code carefully, and drain the entire GOLD token balance from one RaidTreasury instance to complete this exercise.

# Background:

We have deployed multiple instances of the RaidTreasury contract. The [CastleMap](./CastleMap.sol) contract acts as a registry — it stores the addresses of all deployed RaidTreasury contracts. You can call the **getAllTreasury()** function from CastleMap to get a list of these contracts.

# What You Need to Do:

1. Study the RaidTreasury contract — Find the vulnerability.
2. Interact with the vulnerable contract on Remix, and transfer all 20 GOLD tokens to your address.
3. Use **CastleMap.getAllTreasury()** to find a contract that hasn’t been hacked yet.
4. Pick one, hack it, and drain the funds.


# Submission Requirements:

* Submit the address of the RaidTreasury contract you attacked.
* Submit the transaction hash showing the 20 GOLD tokens were transferred to your address.
* (Optional for extra points) A short description of your exploit strategy.

Note: Each RaidTreasury contract can only be hacked once, so act fast!


Deadline: Tuesday: 17th June 2025

[Submission Form](https://forms.gle/aoLFgRi9zLubXSC97)