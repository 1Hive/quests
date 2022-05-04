// @ts-ignore
import { ethers, deployments } from "hardhat";
import { use, expect } from "chai";
import { solidity } from "ethereum-waffle";
import {
  deployQuest,
  hashToBytes,
  getNowAsUnixEpoch,
  fromNumber,
  fromBigNumber,
} from "./test-helper";
import { TokenMock, TokenMock__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { BigNumber } from "ethers";

use(solidity);

describe("[Contract] Quest", function () {
  const epoch0 = 0; // Set expireTime to Unix Epoch 0
  const depositAmount = fromNumber(1);

  let govern: SignerWithAddress;
  let player: SignerWithAddress;
  let creator: SignerWithAddress;
  let other: SignerWithAddress;
  let rewardToken: TokenMock;
  let depositToken: TokenMock;

  beforeEach(async function () {
    [govern, creator, player, other] = await ethers.getSigners();
    const tokenMockFactory = new TokenMock__factory(govern);
    rewardToken = await tokenMockFactory.deploy("Reward Token", "RTOKEN");
    depositToken = await tokenMockFactory.deploy("Deposit Token", "DTOKEN");
  });

  describe("recoverUnclaimedFunds()", function () {
    const questFunds = fromNumber(1000);

    it("SHOULD empty the quest funds and creator recover his funds and deposit", async function () {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epoch0,
        govern.address,
        creator.address,
        questFunds,
        depositToken,
        depositAmount,
        creator
      );

      // Act
      await quest.recoverUnclaimedFunds();

      // Assert
      expect(await rewardToken.balanceOf(quest.address)).to.eq(0);
      expect(await rewardToken.balanceOf(creator.address)).to.eq(questFunds);
      expect(await depositToken.balanceOf(quest.address)).to.eq(0);
      expect(await depositToken.balanceOf(creator.address)).to.eq(
        depositAmount
      );
      expect(await quest.depositHeld()).to.eq(false);
    });

    it("SHOULD revert WHEN not expire", async function () {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        getNowAsUnixEpoch(),
        govern.address,
        creator.address,
        questFunds,
        depositToken,
        depositAmount,
        creator
      );

      // Act
      const act = () => quest.recoverUnclaimedFunds();

      // Assert
      await expect(act()).to.be.revertedWith("ERROR: Not expired");
    });

    it("SHOULD return deposit and remaining funds separately WHEN same reward token than deposit", async () => {
      // Arrange
      const sameToken = rewardToken;
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        sameToken,
        epoch0,
        govern.address,
        other.address,
        questFunds,
        sameToken,
        depositAmount,
        creator
      );
      // Act
      await quest.recoverUnclaimedFunds();

      // Assert
      expect(await sameToken.balanceOf(quest.address)).to.eq(0);
      expect(await sameToken.balanceOf(creator.address)).to.eq(depositAmount);
      expect(await sameToken.balanceOf(other.address)).to.eq(questFunds);
    });
  });

  describe("claim()", function () {
    describe("questFund is 1000", function () {
      const questFunds = fromNumber(1000);

      it("SHOULD transfer amount to player", async function () {
        // Arrange
        const claimAmount = fromNumber(500);
        const quest = await deployQuest(
          "fakeTitle",
          "0x",
          rewardToken,
          epoch0,
          govern.address,
          creator.address,
          questFunds,
          depositToken,
          depositAmount,
          creator
        );

        // Act
        await quest
          .connect(govern)
          .claim(hashToBytes("evidence1"), player.address, claimAmount, false);

        // Assert
        expect(await rewardToken.balanceOf(player.address)).to.eq(claimAmount);
        expect(await rewardToken.balanceOf(quest.address)).to.eq(
          questFunds.sub(claimAmount)
        );
      });

      it("SHOULD transfer remaining funds to player WHEN claimAll", async function () {
        // Arrange
        const claimAmount = fromNumber(500); // Should overriden ignored by claimAll
        const claimAll = true;
        const quest = await deployQuest(
          "fakeTitle",
          "0x",
          rewardToken,
          epoch0,
          govern.address,
          creator.address,
          questFunds,
          depositToken,
          depositAmount,
          creator
        );

        // Act
        await quest
          .connect(govern)
          .claim(
            hashToBytes("evidence1"),
            player.address,
            claimAmount,
            claimAll
          );

        // Assert
        expect(await rewardToken.balanceOf(player.address)).to.eq(questFunds);
        expect(await rewardToken.balanceOf(quest.address)).to.eq(0);
      });

      it("SHOULD emit a ClaimEvent with correct args", async function () {
        // Arrange
        const claimAmount = fromNumber(500);
        const evidence = hashToBytes("evidence1");
        const quest = await deployQuest(
          "fakeTitle",
          "0x",
          rewardToken,
          epoch0,
          govern.address,
          creator.address,
          questFunds,
          depositToken,
          depositAmount,
          creator
        );

        // Act
        const act = () =>
          quest
            .connect(govern)
            .claim(evidence, player.address, claimAmount, false);

        // Assert
        await expect(act())
          .to.emit(quest, "QuestClaimed")
          .withArgs(evidence, player.address, claimAmount);
      });

      it("SHOULD revert if the claim is greater than the quest funds", async function () {
        // Arrange
        const claimAmount = questFunds.add(fromNumber(1));
        const evidence = hashToBytes("evidence1");
        const quest = await deployQuest(
          "fakeTitle",
          "0x",
          rewardToken,
          epoch0,
          govern.address,
          creator.address,
          questFunds,
          depositToken,
          depositAmount,
          creator
        );

        // Act
        const act = () =>
          quest
            .connect(govern)
            .claim(evidence, player.address, claimAmount, false);

        // Assert
        await expect(act()).to.be.revertedWith(
          "ERC20: transfer amount exceeds balance"
        );
      });

      it("SHOULD revert WHEN the there is no provided evidence", async function () {
        // Arrange
        const claimAmount = questFunds.add(fromNumber(1));
        const evidence = [];
        const quest = await deployQuest(
          "fakeTitle",
          "0x",
          rewardToken,
          epoch0,
          govern.address,
          creator.address,
          questFunds,
          depositToken,
          depositAmount,
          creator
        );

        // Act
        const act = () =>
          quest
            .connect(govern)
            .claim(evidence, player.address, claimAmount, false);

        // Assert
        await expect(act()).to.be.revertedWith("ERROR: No evidence");
      });
    });

    it("SHOULD revert WHEN caller is not govern", async function () {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epoch0,
        govern.address,
        creator.address,
        fromNumber(0),
        depositToken,
        depositAmount,
        creator
      );

      // Act
      const act = () =>
        quest
          .connect(player)
          .claim(hashToBytes("evidence1"), player.address, fromNumber(0), true); // player claims by himself

      // Assert
      await expect(act()).to.be.revertedWith("ERROR: Sender not govern");
    });

    it("SHOULD revert WHEN deposit and rewardToken the same and claim amount eat deposit", async () => {
      // Arrange
      const sameToken = rewardToken;
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        sameToken,
        epoch0,
        govern.address,
        creator.address,
        fromNumber(1),
        sameToken,
        fromNumber(1),
        creator
      );

      // Act
      const act = () =>
        quest
          .connect(govern)
          .claim(
            hashToBytes("evidence1"),
            player.address,
            fromNumber(2),
            false
          );

      // Assert
      await expect(act()).to.be.revertedWith(
        "ERROR: Should not exceed allowed bounty"
      );
    });

    it("SHOULD let deposit WHEN deposit and rewardToken the same and claim all", async () => {
      // Arrange
      const sameToken = rewardToken;
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        sameToken,
        epoch0,
        govern.address,
        creator.address,
        fromNumber(1),
        sameToken,
        depositAmount,
        creator
      );

      // Act
      await quest
        .connect(govern)
        .claim(hashToBytes("evidence1"), player.address, 0, true);

      // Assert
      expect(await rewardToken.balanceOf(quest.address)).to.eq(depositAmount);
    });
  });
});
