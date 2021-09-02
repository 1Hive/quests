const { ethers } = require("hardhat");

function hashToBytes(input) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input));
}

async function deployQuest(
  requirements,
  rewardToken,
  expireTime,
  aragonGovernAddress,
  fundsRecoveryAddress,
  initialBalance
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
  await rewardToken.mint(quest.address, initialBalance);
  return quest;
}

function getNowAsUnixEpoch() {
  return Math.round(new Date().getTime() / 1000) + 1000;
}

module.exports = {
  deployQuest,
  hashToBytes,
  getNowAsUnixEpoch,
};
