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
  let epochNow: number;
  const depositAmount = fromNumber(1);

  let govern: SignerWithAddress;
  let player: SignerWithAddress;
  let creator: SignerWithAddress;
  let other: SignerWithAddress;
  let rewardToken: TokenMock;
  let createDepositToken: TokenMock;
  let playDepositToken: TokenMock;

  beforeEach(async function () {
    [govern, creator, player, other] = await ethers.getSigners();
    const tokenMockFactory = new TokenMock__factory(govern);
    rewardToken = await tokenMockFactory.deploy("Reward Token", "RTOKEN");
    createDepositToken = await tokenMockFactory.deploy(
      "Create Deposit Token",
      "CDTOKEN"
    );
    playDepositToken = await tokenMockFactory.deploy(
      "Player Deposit Token",
      "PDTOKEN"
    );
    epochNow = getNowAsUnixEpoch();
  });

  describe("recoverFundsAndDeposit()", function () {
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
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );

      // Act
      await quest.recoverFundsAndDeposit();

      // Assert
      expect(await rewardToken.balanceOf(quest.address)).to.eq(0);
      expect(await rewardToken.balanceOf(creator.address)).to.eq(questFunds);
      expect(await createDepositToken.balanceOf(quest.address)).to.eq(0);
      expect(await createDepositToken.balanceOf(creator.address)).to.eq(
        depositAmount
      );
      expect(await quest.isCreateDepositReleased()).to.eq(true);
    });

    it("SHOULD not release deposit if quest is not held", async function () {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epoch0,
        govern.address,
        creator.address,
        questFunds,
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );
      await quest.recoverFundsAndDeposit();

      // Act
      await quest.recoverFundsAndDeposit();

      // Assert
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
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );

      // Act
      const act = () => quest.recoverFundsAndDeposit();

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
        playDepositToken,
        depositAmount,
        creator
      );
      // Act
      await quest.recoverFundsAndDeposit();

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
          createDepositToken,
          depositAmount,
          playDepositToken,
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
          createDepositToken,
          depositAmount,
          playDepositToken,
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
          createDepositToken,
          depositAmount,
          playDepositToken,
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
          createDepositToken,
          depositAmount,
          playDepositToken,
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
          createDepositToken,
          depositAmount,
          playDepositToken,
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
        createDepositToken,
        depositAmount,
        playDepositToken,
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
        playDepositToken,
        depositAmount,
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
        playDepositToken,
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

  describe("play()", () => {
    it("SHOULD add the given address to player list WHEN player register", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator,
        0 // Max player infinite
      );
      await playDepositToken
        .connect(player)
        .mint(player.address, fromNumber(1000));
      await playDepositToken
        .connect(player)
        .approve(quest.address, depositAmount);

      // Act
      const act = () => quest.connect(player).play(player.address);

      // Assert
      await expect(act()).to.emit(quest, "QuestPlayed");
      expect(await quest.playerList(0)).to.eq(player.address);
      expect(await quest.canExecute(player.address)).to.eq(true);
    });

    it("SHOULD add the given address to player list WHEN creator register a player", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );
      await playDepositToken
        .connect(creator)
        .mint(creator.address, fromNumber(1000));
      await playDepositToken
        .connect(creator)
        .approve(quest.address, depositAmount);

      // Act
      const act = () => quest.connect(creator).play(player.address);

      // Assert
      await expect(act()).to.emit(quest, "QuestPlayed");
      expect(await quest.playerList(0)).to.eq(player.address);
    });

    it("SHOULD revert WHEN given player is not the sender nor creator", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator,
        1 // Max players
      );
      const playerInitialBalance = fromNumber(1000);
      await playDepositToken
        .connect(player)
        .mint(player.address, playerInitialBalance);
      await playDepositToken
        .connect(player)
        .approve(quest.address, depositAmount);

      // Act
      const act = () => quest.connect(other).play(player.address);

      // Assert
      await expect(act()).to.be.revertedWith(
        "ERROR: Sender not player nor creator"
      );
    });

    it("SHOULD revert WHEN no deposit allowance", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );

      // Act
      const act = () => quest.connect(player).play(player.address);

      // Assert
      await expect(act()).to.be.revertedWith("ERROR : Deposit bad allowance");
    });

    it("SHOULD revert WHEN already max players", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator,
        1 // Max players
      );
      const playerInitialBalance = fromNumber(1000);
      await playDepositToken
        .connect(player)
        .mint(player.address, playerInitialBalance);
      await playDepositToken
        .connect(player)
        .approve(quest.address, depositAmount);

      await quest.connect(player).play(player.address); // Player 1 registration

      // Act
      const act = () => quest.connect(other).play(other.address);

      // Assert
      await expect(act()).to.be.revertedWith("ERROR: Max players reached");
    });

    it("SHOULD revert WHEN quest is already expired", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow - 3600, // epxired 1 hour ago
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );
      const playerInitialBalance = fromNumber(1000);
      await playDepositToken
        .connect(player)
        .mint(player.address, playerInitialBalance);
      await playDepositToken
        .connect(player)
        .approve(quest.address, depositAmount);

      // Act
      const act = () => quest.connect(player).play(player.address);

      // Assert
      await expect(act()).to.be.revertedWith("ERROR: Quest expired");
    });

    it("SHOULD revert WHEN player already registered", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );
      const playerInitialBalance = fromNumber(1000);
      await playDepositToken
        .connect(player)
        .mint(player.address, playerInitialBalance);
      await playDepositToken
        .connect(player)
        .approve(quest.address, depositAmount);

      await quest.connect(player).play(player.address); // First registration

      // Act
      const act = () => quest.connect(player).play(player.address);

      // Assert
      await expect(act()).to.be.revertedWith("ERROR: Player already exists");
    });
  });

  describe("unplay()", () => {
    it("SHOULD remove the given address from player list WHEN player unregister", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );
      await playDepositToken
        .connect(player)
        .mint(player.address, fromNumber(1000));
      await playDepositToken
        .connect(player)
        .approve(quest.address, depositAmount);
      await quest.connect(player).play(player.address); // Preregister player

      // Act
      const act = () => quest.connect(player).unplay(player.address);

      // Assert
      await expect(act()).to.emit(quest, "QuestUnplayed");
      expect(await quest.playerList(0)).to.eq(
        "0x0000000000000000000000000000000000000000"
      );
      expect(await quest.canExecute(player.address)).to.eq(false);
      expect(await playDepositToken.balanceOf(quest.address)).to.eq(
        fromNumber(0)
      ); // Expect deposit to be returned
    });

    it("SHOULD remove the given address from player list WHEN creator unregister the player", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );
      await playDepositToken
        .connect(creator)
        .mint(creator.address, fromNumber(1000));
      await playDepositToken
        .connect(creator)
        .approve(quest.address, depositAmount);
      await quest.connect(creator).play(player.address); // Preregister player

      // Act
      const act = () => quest.connect(creator).unplay(player.address);

      // Assert
      await expect(act()).to.emit(quest, "QuestUnplayed");
      expect(await quest.playerList(0)).to.eq(
        "0x0000000000000000000000000000000000000000"
      );
      expect(await quest.canExecute(player.address)).to.eq(false);
      expect(await playDepositToken.balanceOf(player.address)).to.eq(
        depositAmount
      ); // Expect player to receive deposit back
    });

    it("SHOULD revert WHEN sender is not creator nor player", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );
      await playDepositToken.mint(other.address, fromNumber(1000));
      await playDepositToken.mint(player.address, fromNumber(1000));
      await playDepositToken
        .connect(player)
        .approve(quest.address, depositAmount);
      await quest.connect(player).play(player.address); // Preregister player

      // Act
      const act = () => quest.connect(other).unplay(player.address);

      // Assert
      await expect(act()).to.be.revertedWith(
        "ERROR: Sender not player nor creator"
      );
    });

    it("SHOULD revert WHEN player not registered", async () => {
      // Arrange
      const quest = await deployQuest(
        "fakeTitle",
        "0x",
        rewardToken,
        epochNow + 3600, // in 1 hour
        govern.address,
        creator.address,
        fromNumber(0),
        createDepositToken,
        depositAmount,
        playDepositToken,
        depositAmount,
        creator
      );
      await playDepositToken.mint(creator.address, fromNumber(1000));
      await playDepositToken
        .connect(creator)
        .approve(quest.address, depositAmount);
      await quest.connect(creator).play(player.address); // Preregister player

      // Act
      const act = () => quest.connect(creator).unplay(other.address);

      // Assert
      await expect(act()).to.be.revertedWith("ERROR: player not in list");
    });
  });
});
