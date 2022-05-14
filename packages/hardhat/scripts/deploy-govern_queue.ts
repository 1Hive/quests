import GovernQueueFactoryAbi from "../abi/contracts/Externals/GovernQueueFactory.json";
import { HardhatRuntimeEnvironment, Network } from "hardhat/types";
import fs from "fs";
import { BigNumber, ethers } from "ethers";
import exportContractResult from "./export-contract-result";
import GovernQueueAbi from "../abi/contracts/Externals/GovernQueue.json";

export function generateQueueConfig(args: {
  executionDelay: number;
  scheduleDepositToken: string;
  scheduleDepositAmount: number;
  challengeDepositToken: string;
  challengeDepositAmount: number;
  resolver: string;
  rules: string;
  maxCalldataSize: number;
}) {
  return {
    executionDelay: args.executionDelay,
    scheduleDeposit: {
      token: args.scheduleDepositToken,
      amount: ethers.utils.parseEther(args.scheduleDepositAmount.toString()),
    },
    challengeDeposit: {
      token: args.challengeDepositToken,
      amount: ethers.utils.parseEther(args.challengeDepositAmount.toString()),
    },
    resolver: args.resolver,
    rules: args.rules,
    maxCalldataSize: args.maxCalldataSize,
  };
}

export default async function deployGovernQueue(
  args: {
    aclRoot: string;
    governQueueFactoryAddress: string;
    executionDelay: number;
    scheduleDepositToken: string;
    scheduleDepositAmount: number;
    challengeDepositToken: string;
    challengeDepositAmount: number;
    resolver: string;
  },
  { network, ethers }: HardhatRuntimeEnvironment
) {
  const queueFactory = await ethers.getContractAt(
    GovernQueueFactoryAbi,
    args.governQueueFactoryAddress
  );

  const tx = await queueFactory.newQueue(
    args.aclRoot,
    generateQueueConfig({
      executionDelay: args.executionDelay,
      scheduleDepositAmount: args.scheduleDepositAmount,
      scheduleDepositToken: args.scheduleDepositToken,
      challengeDepositToken: args.challengeDepositToken,
      challengeDepositAmount: args.challengeDepositAmount,
      resolver: args.resolver,
      rules: ethers.constants.HashZero,
      maxCalldataSize: 100000,
    }),
    ethers.constants.HashZero,
    {
      gasPrice: "5000000000",
    }
  );
  console.log("Deploying GovernQueue... tx:", tx.hash);
  const res = await tx.wait();
  const newQueueAddress = res.logs[0].address;
  console.log("Deployed GovernQueue (" + network.name + "): ", newQueueAddress);

  exportContractResult(network, "GovernQueue", {
    address: newQueueAddress,
    abi: GovernQueueAbi as [],
  });
  return newQueueAddress;
}
