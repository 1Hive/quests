// @ts-ignore
import { ethers, deployments } from "hardhat";
import { use, expect } from "chai";
import { solidity } from "ethereum-waffle";
import { hashToBytes } from "./test-helper";

use(solidity);

describe("[Contract] QuestFactory", function () {
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

  it("should set the owner address correctly", async function () {
    expect(!!owner.address).to.eq(true); // truthy
  });

  describe("createQuest()", function () {
    let questFactoryContract;

    beforeEach(async function () {
      await deployments.fixture(["TokenMock", "QuestFactory"]);
      questFactoryContract = await ethers.getContract("QuestFactory");
    });

    it("should emit QuestCreated", async function () {
      // Arrange
      const tokenContract = await deployments.get("TokenMock");
      const requirements = hashToBytes("requirement1");
      const expireTime = 0; // Unix Epoch 0

      // Act
      // Assert
      expect(
        await questFactoryContract.createQuest(
          requirements,
          tokenContract.address,
          expireTime,
          owner.address
        )
      ).to.emit(questFactoryContract, "QuestCreated");
    });
  });
});
