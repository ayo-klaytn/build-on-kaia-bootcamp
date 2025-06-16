import { expect } from "chai"
import { ethers } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { VulnerableBank, SecureBank, Attacker } from "../typechain-types"

describe("Reentrancy Demo", function () {
    async function deployContractsFixture() {
        const [owner, attacker, depositor1, depositor2] =
            await ethers.getSigners()
        const depositAmount = ethers.parseEther("1.0")

        // Deploy vulnerable bank
        const VulnerableBank = await ethers.getContractFactory("VulnerableBank")
        const vulnerableBank =
            (await VulnerableBank.deploy()) as unknown as VulnerableBank

        // Deploy secure bank
        const SecureBank = await ethers.getContractFactory("SecureBank")
        const secureBank = (await SecureBank.deploy()) as unknown as SecureBank

        // Deploy attacker contract
        const Attacker = await ethers.getContractFactory("Attacker")
        const attackerContract = (await Attacker.deploy(
            await vulnerableBank.getAddress()
        )) as unknown as Attacker

        return {
            vulnerableBank,
            secureBank,
            attackerContract,
            owner,
            attacker,
            depositor1,
            depositor2,
            depositAmount
        }
    }

    describe("Vulnerable Bank", function () {
        it("Should be vulnerable to reentrancy attack", async function () {
            const {
                vulnerableBank,
                attackerContract,
                depositor1,
                depositor2,
                depositAmount
            } = await loadFixture(deployContractsFixture)

            // Multiple users deposit to the bank
            await vulnerableBank
                .connect(depositor1)
                .deposit({ value: depositAmount })
            await vulnerableBank
                .connect(depositor2)
                .deposit({ value: depositAmount })

            // Initial bank balance should be 2 ETH
            const initialBankBalance = await ethers.provider.getBalance(
                await vulnerableBank.getAddress()
            )
            expect(initialBankBalance).to.equal(depositAmount * 2n)

            // Attacker deposits 1 ETH
            await attackerContract.attack({ value: depositAmount })

            // Check if attack was successful - attacker should have more than 1 ETH
            const attackerBalance = await ethers.provider.getBalance(
                await attackerContract.getAddress()
            )
            expect(attackerBalance).to.be.gt(depositAmount)

            // Bank should be drained
            const finalBankBalance = await ethers.provider.getBalance(
                await vulnerableBank.getAddress()
            )
            expect(finalBankBalance).to.equal(0)
        })
    })

    describe("Secure Bank", function () {
        it("Should prevent reentrancy attack", async function () {
            const {
                secureBank,
                attackerContract,
                depositor1,
                depositor2,
                depositAmount
            } = await loadFixture(deployContractsFixture)

            // Multiple users deposit to the bank
            await secureBank
                .connect(depositor1)
                .deposit({ value: depositAmount })
            await secureBank
                .connect(depositor2)
                .deposit({ value: depositAmount })

            // Initial bank balance should be 2 ETH
            const initialBankBalance = await ethers.provider.getBalance(
                await secureBank.getAddress()
            )
            expect(initialBankBalance).to.equal(depositAmount * 2n)

            // Try to execute attack
            await expect(
                attackerContract.attack({ value: depositAmount })
            ).to.be.revertedWith("Reentrant call")

            // Bank balance should remain unchanged
            const finalBankBalance = await ethers.provider.getBalance(
                await secureBank.getAddress()
            )
            expect(finalBankBalance).to.equal(depositAmount * 2n)
        })
    })
})
