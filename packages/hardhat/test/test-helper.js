const { ethers } = require("hardhat");

const FAKE_ADDRESS = "0x0000000000000000000000000000000000000000";

async function deployQuestFactory(governAddress = FAKE_ADDRESS) {
  const QuestFactory = await ethers.getContractFactory("QuestFactory");
  const questFactory = await QuestFactory.deploy(governAddress);
  await questFactory.deployed();
  return questFactory;
}

async function deployQuest(
  requirements,
  rewardToken,
  expireTime,
  aragonGovernAddress,
  fundsRecoveryAddress
) {
  const Quest = await ethers.getContractFactory("Quest");
  const quest = await Quest.deploy(
    requirements,
    rewardToken.address,
    expireTime,
    aragonGovernAddress,
    fundsRecoveryAddress
  );
  await quest.deployed();
  await rewardToken.mint(quest.address);
  return quest;
}

async function deployFakeToken(initialBalance) {
  const FakeRewardToken = await ethers.getContractFactory("RewardTokenMock");
  const fakeRewardToken = await FakeRewardToken.deploy(initialBalance);
  await fakeRewardToken.deployed();
  return fakeRewardToken;
}

module.exports = {
  FAKE_ADDRESS,
  deployQuestFactory,
  deployQuest,
  deployFakeToken,
};
