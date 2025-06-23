# Objective

Familiarize yourself with building decentralized application and executing transaction from the dApp on the Kaia blockchain.

# Exercise

1. Create a Simple Voting DApp
2. Write the Voting contract code.

    ✅ A. Create Multiple Voting Events
    * Each voting event should:
    * Have a unique ID or name.
    * Track:
            List of candidates (with address and name)
            Voting deadline (endDate)
            Voters who have voted
            Total vote count for each candidate
            Whether the winner has been determined

    ✅ B. Register Candidates
    * Allow an admin/owner (or anyone) to register candidates before the voting ends.
    * Each candidate should have:
        address (for identity)
        name (for display)
        A counter for how many votes they've received

    ✅ C. Voting Logic
    * Each voter should be able to vote once per event.
    * They vote by selecting a candidate’s address.
    * The contract tracks that they’ve already voted for that event.

    ✅ D. Voting Deadline
    * The event should stop accepting votes after the end date/time.
    * You can use block.timestamp to compare against the endDate.

    ✅ E. Determine Winner
    * After the deadline, a function should return the winning candidate (with the highest votes).
    * Could optionally allow the admin to manually call a getWinner() function to fetch the result

3. Deploy the contract to the Kairos testnet.
4. From the frontend, communicate with the deployed contract.

> Note: This is a guideline. You can implement your voting contract to contain basic functionalities of a voting system. 

[Submission Link](https://forms.gle/8YigBanFcnwSQZPV8)

Submission Deadline: 03/07/2025