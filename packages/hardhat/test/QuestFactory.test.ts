// @ts-ignore
import { ethers, deployments } from "hardhat";
import { use, expect } from "chai";
import { solidity } from "ethereum-waffle";

use(solidity);

describe("[Contract] QuestFactory", function () {
  let owner;
  let questFactoryContract;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

  beforeEach(async function () {
    await deployments.fixture(["TokenMock", "QuestFactory"]);
    questFactoryContract = await ethers.getContract("QuestFactory");
  });

  it("should set the owner address correctly", async function () {
    expect(!!owner.address).to.eq(true); // truthy
  });

  describe("createQuest()", function () {
    it("should emit QuestCreated", async function () {
      // Arrange
      const tokenContract = await deployments.get("TokenMock");
      const title = "title";
      const detailIPFS = "0x";
      const expireTime = 0; // Unix Epoch 0

      // Act
      // Assert
      expect(
        await questFactoryContract.createQuest(
          title,
          detailIPFS,
          tokenContract.address,
          expireTime,
          owner.address
        )
      ).to.emit(questFactoryContract, "QuestCreated");
    });
  });

  describe("setDeposit()", function () {
    it("when valid, should emit DepositChanged", () => {
      // Arrange
      // Act
      // Assert
    });
    it("when not ownner, should revert", () => {
      // Arrange
      // Act
      // Assert
    });
    it("when not IERC20, should revert", () => {
      // Arrange
      // Act
      // Assert
    });
    it("when creating a Quest, then change depoosit, Quest should have old deposit", () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
