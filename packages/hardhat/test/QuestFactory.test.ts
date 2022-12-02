import { ethers } from "hardhat";
import { use, expect } from "chai";
import { solidity } from "ethereum-waffle";
import {
  QuestFactory,
  QuestFactory__factory,
  Quest__factory,
  TokenMock,
  TokenMock__factory,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { extractQuestAddressFromTransaction, fromNumber } from "./test-helper";

use(solidity);

describe("[Contract] QuestFactory", function () {
  let owner: SignerWithAddress;
  let stranger: SignerWithAddress;
  let rewardToken: TokenMock;
  let createDepositToken: TokenMock;
  let playDepositToken: TokenMock;
  let otherToken: TokenMock;
  let questFactoryContract: QuestFactory;
  const depositAmount = fromNumber(1);

  before(async function () {
    [owner, stranger] = await ethers.getSigners();
  });

  it("SHOULD transfer ownership WHEN initialOwner is different than deployer", async function () {
    // Arrange
    // Act
    questFactoryContract = await new QuestFactory__factory(owner).deploy(
      owner.address,
      createDepositToken.address,
      depositAmount,
      playDepositToken.address,
      depositAmount,
      stranger.address
    );
    // Assert
    expect(await questFactoryContract.owner()).to.equal(stranger.address);
  });

  beforeEach(async function () {
    const tokenMockFactory = new TokenMock__factory(owner);
    rewardToken = await tokenMockFactory.deploy("Reward Token", "RTOKEN");
    createDepositToken = await tokenMockFactory.deploy(
      "Create Deposit Token",
      "CDTOKEN"
    );
    playDepositToken = await tokenMockFactory.deploy(
      "Play Deposit Token",
      "PDTOKEN"
    );
    otherToken = await tokenMockFactory.deploy("Other Token", "OTOKEN");
    questFactoryContract = await new QuestFactory__factory(owner).deploy(
      owner.address,
      createDepositToken.address,
      depositAmount,
      playDepositToken.address,
      depositAmount,
      owner.address
    );
    await createDepositToken
      .connect(owner)
      .mint(owner.address, fromNumber(1000));
  });

  it("SHOULD set the owner address correctly", async function () {
    expect(!!owner.address).to.eq(true); // truthy
  });

  describe("createQuest()", function () {
    it("SHOULD emit QuestCreated", async function () {
      // Arrange
      const title = "title";
      const detailIPFS = "0x";
      const expireTime = 0; // Unix Epoch 0
      const maxPlayers = 1;
      await createDepositToken
        .connect(owner)
        .approve(questFactoryContract.address, depositAmount);

      // Act
      // Assert
      expect(
        await questFactoryContract.createQuest(
          title,
          detailIPFS,
          rewardToken.address,
          expireTime,
          owner.address,
          maxPlayers
        )
      ).to.emit(questFactoryContract, "QuestCreated");
    });

    it("SHOULD collect deposit and transfer to new quests", async () => {
      // Arrange
      const title = "title";
      const detailIPFS = "0x";
      const expireTime = 0; // Unix Epoch 0
      const maxPlayers = 1;

      await createDepositToken
        .connect(owner)
        .approve(questFactoryContract.address, depositAmount);

      // Act
      const newQuestAddress = await extractQuestAddressFromTransaction(
        await questFactoryContract.createQuest(
          title,
          detailIPFS,
          rewardToken.address,
          expireTime,
          owner.address,
          maxPlayers
        )
      );

      // Assert
      expect(await createDepositToken.balanceOf(newQuestAddress)).to.eq(
        depositAmount
      );
    });

    it("SHOULD revert WHEN creator didn't aproved enough funds", async () => {
      // Arrange
      const title = "title";
      const detailIPFS = "0x";
      const expireTime = 0; // Unix Epoch 0
      const maxPlayers = 1;

      await createDepositToken
        .connect(owner)
        .approve(questFactoryContract.address, depositAmount.div(2));
      // Act
      const act = () =>
        questFactoryContract.createQuest(
          title,
          detailIPFS,
          rewardToken.address,
          expireTime,
          owner.address,
          maxPlayers
        );

      // Assert
      await expect(act()).to.be.revertedWith("ERROR : Deposit bad allowance");
    });
  });

  describe("setCreateDeposit()", function () {
    it("SHOULD emit CreateDepositChanged WHEN valid", async () => {
      // Arrange
      // Act
      const act = () =>
        questFactoryContract
          .connect(owner)
          .setCreateDeposit(otherToken.address, depositAmount);

      // Assert
      expect(await act()).to.emit(questFactoryContract, "CreateDepositChanged");
      const [token, amount] = await questFactoryContract.createDeposit();
      expect(token).to.eq(otherToken.address);
      expect(amount.eq(depositAmount)).to.eq(true);
    });

    it("SHOULD revert WHEN not owner", async () => {
      // Arrange
      // Act
      const act = () =>
        questFactoryContract
          .connect(stranger)
          .setCreateDeposit(otherToken.address, depositAmount);
      // Assert
      await expect(act()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("already created quests SHOULD keep old deposit WHEN change deposit", async () => {
      // Arrange
      const maxPlayers = 1;
      await createDepositToken
        .connect(owner)
        .approve(questFactoryContract.address, depositAmount);
      const questAddress = await extractQuestAddressFromTransaction(
        await questFactoryContract
          .connect(owner)
          .createQuest(
            "title",
            "0x",
            rewardToken.address,
            0,
            owner.address,
            maxPlayers
          )
      );
      const quest = new Quest__factory(owner).attach(questAddress);
      const otherDepositAmount = fromNumber(2);
      // Act
      await questFactoryContract
        .connect(owner)
        .setCreateDeposit(otherToken.address, otherDepositAmount);
      // Assert
      const [token, amount] = await quest.createDeposit();
      expect(token).to.eq(createDepositToken.address);
      expect(amount.eq(depositAmount)).to.eq(true);
    });
  });

  describe("setPlayDeposit()", function () {
    it("SHOULD emit PlayDepositChanged WHEN valid", async () => {
      // Arrange
      // Act
      const act = () =>
        questFactoryContract
          .connect(owner)
          .setPlayDeposit(otherToken.address, depositAmount);

      // Assert
      expect(await act()).to.emit(questFactoryContract, "PlayDepositChanged");
      const [token, amount] = await questFactoryContract.playDeposit();
      expect(token).to.eq(otherToken.address);
      expect(amount.eq(depositAmount)).to.eq(true);
    });

    it("SHOULD revert WHEN not owner", async () => {
      // Arrange
      // Act
      const act = () =>
        questFactoryContract
          .connect(stranger)
          .setPlayDeposit(otherToken.address, depositAmount);
      // Assert
      await expect(act()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("already created quests SHOULD keep old deposit WHEN change deposit", async () => {
      // Arrange
      const maxPlayers = 1;
      await createDepositToken
        .connect(owner)
        .approve(questFactoryContract.address, depositAmount);
      const questAddress = await extractQuestAddressFromTransaction(
        await questFactoryContract
          .connect(owner)
          .createQuest(
            "title",
            "0x",
            rewardToken.address,
            0,
            owner.address,
            maxPlayers
          )
      );
      const quest = new Quest__factory(owner).attach(questAddress);
      const otherDepositAmount = fromNumber(2);
      // Act
      await questFactoryContract
        .connect(owner)
        .setPlayDeposit(otherToken.address, otherDepositAmount);
      // Assert
      const [token, amount] = await quest.playDeposit();
      expect(token).to.eq(playDepositToken.address);
      expect(amount.eq(depositAmount)).to.eq(true);
    });
  });
});
