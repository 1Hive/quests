import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import defaultConfig from "../default-config.json";

export default async (
  {
    getNamedAccounts,
    deployments,
    ethers,
    network,
    run,
  }: HardhatRuntimeEnvironment,
  args?: {
    governAddress: string;
    createDepositToken: string;
    createDepositAmount: number;
  }
) => {
  const { deploy } = deployments;
  const { deployer, govern, owner } = await getNamedAccounts();
  const deposit = args
    ? { token: args.createDepositToken, amount: args.createDepositAmount }
    : defaultConfig.CreateQuestDeposit[network.name];
  const constructorArguments = [
    args.governAddress ?? govern,
    deposit.token,
    ethers.utils.parseEther(deposit.amount.toString()),
    owner,
  ];
  const deployResult = await deploy("QuestFactory", {
    from: deployer,
    args: constructorArguments,
    log: true,
  });
  await ethers.getContract("QuestFactory", deployResult.address);

  try {
    console.log("Verifying QuestFactory...");
    setTimeout(
      async () =>
        await run("verify:verify", {
          address: deployResult.address,
          constructorArguments,
        }),
      2000
    ); // Wait for contract to be deployed
  } catch (error) {
    console.error("Failed when verifying the QuestFactory", error);
  }

  return deployResult;
};
export const tags = ["QuestFactory"];
