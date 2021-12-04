import { Contract } from "@ethersproject/contracts";
import { ethers } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";

const hashToBytes = (input) => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input));
};

const deployQuest = async (
  title: string,
  detailIpfsHash: string,
  rewardToken: Contract,
  expireTime: number,
  aragonGovernAddress: Address,
  fundsRecoveryAddress: Address,
  initialBalance: number
) => {
  const Quest = await ethers.getContractFactory("Quest");
  const quest = await Quest.deploy(
    title,
    detailIpfsHash,
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
