import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";
import { Quest__factory, TokenMock } from "../typechain";

export const hashToBytes = (input) => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input));
};

export const deployQuest = async (
  title: string,
  detailIpfsHash: string,
  rewardToken: TokenMock,
  expireTime: number,
  aragonGovernAddress: Address,
  fundsRecoveryAddress: Address,
  initialBalance: BigNumber,
  depositToken: TokenMock,
  depositAmount: BigNumber,
  creator: SignerWithAddress
) => {
  const quest = await new Quest__factory(creator).deploy(
    title,
    detailIpfsHash,
    rewardToken.address,
    expireTime,
    aragonGovernAddress,
    fundsRecoveryAddress,
    depositToken.address,
    depositAmount,
    creator.address
  );
  await quest.deployed();
  await rewardToken.connect(quest.signer).mint(quest.address, initialBalance);
  await depositToken.connect(quest.signer).mint(quest.address, depositAmount);
  return quest;
};

export const getNowAsUnixEpoch = () => {
  return Math.round(new Date().getTime() / 1000) + 1000;
};

export const fromNumber = (amount: number): BigNumber => {
  return BigNumber.from(ethers.utils.parseUnits(amount.toString(), 18));
};
export const fromBigNumber = (bn: BigNumber): number => {
  return +ethers.utils.formatEther(bn);
};

export const extractQuestAddressFromTransaction = async (
  tx: ContractTransaction
) => {
  const receipt = await tx.wait();
  return receipt?.events.flatMap((x) => x.args).filter((x) => !!x)[0];
};
