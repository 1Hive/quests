// @ts-ignore
const { ethers } = require("hardhat");
const { expect } = require("chai");
const {
  deployTokenMock,
  deployQuestFactory,
  hashToBytes,
} = require("./test-helper");

describe("[Contract] QuestFactory", function () {
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

  it("should set the owner address correctly", async function () {
    expect(!!owner.address).to.eq(true); // truthy
  });

  describe("createQuest()", function () {
    let questFactory;

    beforeEach(async function () {
      questFactory = await deployQuestFactory(owner.address);
    });

    it("should emit QuestCreated", async function () {
      // Arrange
      const requirements = hashToBytes("requirement1");
      const fakeToken = await deployTokenMock(0);
      const expireTime = 0; // Unix Epoch 0

      // Act
      // Assert
      expect(
        await questFactory.createQuest(
          requirements,
          fakeToken.address,
          expireTime,
          owner.address
        )
      ).to.emit(questFactory, "QuestCreated");
    });
  });
});
