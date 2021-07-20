const { ethers } = require("hardhat");

const FAKE_GOVERN_ADDRESS = "0x0000000000000000000000000000000000000000";

function hashToBytes(input) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input));
}

async function deployQuestFactory(governAddress = FAKE_GOVERN_ADDRESS) {
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
    hashToBytes(requirements),
    rewardToken.address,
    expireTime,
    aragonGovernAddress,
    fundsRecoveryAddress
  );
  await quest.deployed();
  await rewardToken.mint(quest.address);
  return quest;
}

async function deployTokenMock(
  initialBalance,
  name = "RewardTokenMock",
  symbol = "RTM"
) {
  const FakeRewardToken = await ethers.getContractFactory("TokenMock");
  const fakeRewardToken = await FakeRewardToken.deploy(
    initialBalance,
    name,
    symbol
  );
  await fakeRewardToken.deployed();
  return fakeRewardToken;
}

function getNowAsUnixEpoch() {
  return Math.round(new Date().getTime() / 1000) + 1000;
}

module.exports = {
  FAKE_GOVERN_ADDRESS,
  deployQuestFactory,
  deployQuest,
  deployTokenMock,
  hashToBytes,
  getNowAsUnixEpoch,
};
