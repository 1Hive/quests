const { ethers } = require("hardhat");
const { fail } = require("assert");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { deployFakeToken, deployQuest } = require("./test-helper");

const FAKE_ADDRESS = "0x0000000000000000000000000000000000000000";

use(solidity);

describe("[Contract] Quest", function () {
  let ownerAddress;
  let playerAddress;

  before(async function () {
    const [owner, player] = await ethers.getSigners();
    ownerAddress = owner.address;
    playerAddress = player.address;
  });

  describe("recoverUnclaimedFunds()", function () {
    it("should empty the quest funds", async function () {
      // Arrange
      const questFund = 1000;
      const rewardToken = await deployFakeToken(questFund);
      const quest = await deployQuest(
        0x0,
        rewardToken,
        1, // Set expireTime to Unix Epoch 0
        FAKE_ADDRESS,
        ownerAddress
      );

      // Act
      await quest.recoverUnclaimedFunds();

      // Assert
      expect(await rewardToken.balanceOf(quest.address)).to.eq(0);
      expect(await rewardToken.balanceOf(ownerAddress)).to.eq(questFund);
    });

    it("should throw if not expire", async function () {
      // Arrange
      const questFund = 1000;
      const rewardToken = await deployFakeToken(questFund);
      const quest = await deployQuest(
        0x0,
        rewardToken,
        Math.round(new Date().getTime() / 1000) + 1000, // now in unich epoch
        FAKE_ADDRESS,
        ownerAddress
      );

      try {
        // Act
        await quest.recoverUnclaimedFunds();
        // Assert
        fail("AssertionError : Should throw because quest is not yet expired");
      } catch (err) {
        expect(err.message).to.contains("ERROR: Not expired");
      }
    });
  });

  describe("recoverNativeTokens()", function () {
    it("should set the balance", async function () {
      // Arrange
      const questFund = 1000;
      const rewardToken = await deployFakeToken(questFund);
      const quest = await deployQuest(
        0x0,
        rewardToken,
        0,
        ownerAddress,
        ownerAddress
      );

      // Act
      await quest.recoverNativeTokens();

      // Assert
      expect(await rewardToken.balanceOf(ownerAddress)).to.eq(0);
    });
  });

  describe("claim()", function () {
    it("should transfer amount to player", async function () {
      // Arrange
      const questFund = 1000;
      const claimAmount = 500;
      const rewardToken = await deployFakeToken(questFund);
      const quest = await deployQuest(
        0x0,
        rewardToken,
        0,
        ownerAddress,
        ownerAddress
      );

      // Act
      await quest.claim(0x0, playerAddress, claimAmount);

      // Assert
      expect(await rewardToken.balanceOf(playerAddress)).to.eq(claimAmount);
      expect(await rewardToken.balanceOf(quest.address)).to.eq(
        questFund - claimAmount
      );
    });
    it("should transfer rest of available funds to player when claimAmount is 0", async function () {
      // Arrange
      const questFund = 1000;
      const claimAmount = 0;
      const rewardToken = await deployFakeToken(questFund);
      const quest = await deployQuest(
        0x0,
        rewardToken,
        0,
        ownerAddress,
        ownerAddress
      );

      // Act
      await quest.claim(0x0, playerAddress, claimAmount);

      // Assert
      expect(await rewardToken.balanceOf(playerAddress)).to.eq(questFund);
      expect(await rewardToken.balanceOf(quest.address)).to.eq(0);
    });
    it("should throw if caller is not govern", async function () {
      // Arrange
      const rewardToken = await deployFakeToken(0);
      const quest = await deployQuest(
        0x0,
        rewardToken,
        0,
        FAKE_ADDRESS, // Faking the govern address is not the current
        ownerAddress
      );

      // Act
      // Assert
      try {
        await quest.claim(0x0, playerAddress, 0);
        fail(
          "AssertionError : Expect claim() throw exception when not called from govern address."
        );
      } catch (error) {
        expect(error.message).to.contains("ERROR: Sender not govern");
      }
    });
  });
});
