import { ethers } from "hardhat";

const hashToBytes = (input) => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input));
};

const deployQuest = async (
  requirements,
  rewardToken,
  expireTime,
  aragonGovernAddress,
  fundsRecoveryAddress,
  initialBalance
) => {
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
};

const getNowAsUnixEpoch = () => {
  return Math.round(new Date().getTime() / 1000) + 1000;
};

export { deployQuest, hashToBytes, getNowAsUnixEpoch };
