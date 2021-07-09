const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { deployFakeToken, deployQuestFactory } = require("./test-helper");

use(solidity);

describe("[Contract] QuestFactory", function () {
  let ownerAddress;

  before(async function () {
    const [owner] = await ethers.getSigners();
    ownerAddress = owner.address;
  });

  describe("createQuest()", function () {
    let questFactory;

    beforeEach(async function () {
      questFactory = await deployQuestFactory(ownerAddress);
    });

    it("should emit QuestCreated", async function () {
      // Arrange
      const requirements = 0x0;
      const fakeToken = await deployFakeToken(0);
      const expireTime = 0;

      // Act
      // Assert
      expect(
        await questFactory.createQuest(
          requirements,
          fakeToken.address,
          expireTime,
          ownerAddress
        )
      ).to.emit(questFactory, "QuestCreated");
    });
  });
});
