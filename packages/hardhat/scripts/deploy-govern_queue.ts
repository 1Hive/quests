import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/dist/src/types";
import GovernQueueFactoryAbi from "../abi/contracts/Externals/GovernQueueFactory.json";
import { HardhatRuntimeEnvironment, Network } from "hardhat/types";
import fs from "fs";
import { BigNumber } from "ethers";

export default async function deployGovernQueue(
  args: {
    aclRoot: string;
    governQueueFactoryAddress: string;
    resolver: string;
    executionDelay: number;
    scheduleDepositToken: string;
    scheduleDepositAmount: number;
    challengeDepositToken: string;
    challengeDepositAmount: number;
  },
  { network, ethers }: HardhatRuntimeEnvironment
) {
  const queueFactory = await ethers.getContractAt(
    GovernQueueFactoryAbi,
    args.governQueueFactoryAddress
  );
  const config = {
    resolver: args.resolver,
    executionDelay: args.executionDelay,
    scheduleDeposit: {
      token: args.scheduleDepositToken,
      amount: BigNumber.from(
        ethers.utils.parseEther(args.scheduleDepositAmount.toString())
      ),
    },
    challengeDeposit: {
      token: args.challengeDepositToken,
      amount: BigNumber.from(
        ethers.utils.parseEther(args.challengeDepositAmount.toString())
      ),
    },
    rules: ethers.constants.HashZero,
    maxCalldataSize: 100000,
  };
  const tx = await queueFactory.newQueue(
    args.aclRoot,
    config,
    ethers.constants.HashZero
  );
  const res = await tx.wait();
  const newQueueAddress = res.logs[0].address;
  console.log("Deployed GovernQueue (" + network.name + "): ", newQueueAddress);
  fs.writeFileSync(
    "./deployments/" + network.name + "/GovernQueue.json",
    JSON.stringify({
      address: newQueueAddress,
    })
  );
  return newQueueAddress;
}
