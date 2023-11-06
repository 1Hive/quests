import { ethers, upgrades } from "hardhat";
import { use, expect } from "chai";
import { solidity } from "ethereum-waffle";
import {
  QuestFactory,
  QuestFactory__factory,
  Quest__factory,
  TokenMock,
  TokenMock__factory,
} from "../typechain";
import { extractQuestAddressFromTransaction, fromNumber } from "./test-helper";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

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
    await createDepositToken
      .connect(owner)
      .mint(owner.address, fromNumber(1000));
  });

  describe("Methods", () => {
    beforeEach(async function () {
      const contractFactory = await ethers.getContractFactory(
        "QuestFactory",
        owner
      );
      questFactoryContract = (await upgrades.deployProxy(
        contractFactory,
        [owner.address],
        {
          initializer: "initialize",
        }
      )) as QuestFactory;
      questFactoryContract.setCreateDeposit(
        createDepositToken.address,
        depositAmount
      );
      questFactoryContract.setPlayDeposit(
        playDepositToken.address,
        depositAmount
      );
      await questFactoryContract.deployed();
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
        const isWhiteList = false;
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
            maxPlayers,
            isWhiteList
          )
        ).to.emit(questFactoryContract, "QuestCreated");
      });

      it("SHOULD collect deposit and transfer to new quests", async () => {
        // Arrange
        const title = "title";
        const detailIPFS = "0x";
        const expireTime = 0; // Unix Epoch 0
        const maxPlayers = 1;
        const isWhiteList = false;

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
            maxPlayers,
            isWhiteList
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
        const isWhiteList = false;

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
            maxPlayers,
            isWhiteList
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
        expect(await act()).to.emit(
          questFactoryContract,
          "CreateDepositChanged"
        );
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
        const isWhiteList = false;
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
              maxPlayers,
              isWhiteList
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
        const isWhiteList = false;
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
              maxPlayers,
              isWhiteList
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

    describe("setAragonGovernAddress()", function () {
      it("SHOULD set AragonGovernAddress WHEN valid", async () => {
        // Arrange
        const newGovernAddress = "0x0000000000000000000000000000000000000001";
        // Act
        await questFactoryContract
          .connect(owner)
          .setAragonGovernAddress(newGovernAddress);

        // Assert
        expect(await questFactoryContract.aragonGovernAddress()).to.eq(
          newGovernAddress
        );
      });

      it("SHOULD revert WHEN not owner", async () => {
        // Arrange
        const newGovernAddress = "0x0000000000000000000000000000000000000001";
        // Act
        const act = () =>
          questFactoryContract
            .connect(stranger)
            .setAragonGovernAddress(newGovernAddress);
        // Assert
        await expect(act()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
  });
});
