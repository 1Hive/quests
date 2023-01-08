import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import defaultConfig from "../default-config.json";
import exportContractResult from "../scripts/export-contract-result";

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
    playDepositToken: string;
    playDepositAmount: number;
  }
) => {
  const { deploy } = deployments;
  const { deployer, govern, owner } = await getNamedAccounts();
  const createDeposit = args
    ? { token: args.createDepositToken, amount: args.createDepositAmount }
    : defaultConfig.CreateQuestDeposit[network.name];
  const playDeposit = args
    ? { token: args.playDepositToken, amount: args.playDepositAmount }
    : defaultConfig.PlayQuestDeposit[network.name];
  const constructorArguments = [
    args?.governAddress ?? govern,
    createDeposit.token,
    ethers.utils.parseEther(createDeposit.amount.toString()),
    playDeposit.token,
    ethers.utils.parseEther(playDeposit.amount.toString()),
    owner,
  ];
  console.log({ constructorArguments });
  const deployResult = await deploy("QuestFactory", {
    from: deployer,
    args: constructorArguments,
    log: true,
    // gasLimit: 4000000,
  });
  await ethers.getContract("QuestFactory", deployResult.address);

  try {
    console.log("Verifying QuestFactory...");
    await new Promise((res, rej) => {
      setTimeout(
        () =>
          run("verify:verify", {
            address: deployResult.address,
            constructorArguments,
          })
            .then(res)
            .catch(rej),
        30000
      ); // Wait for contract to be deployed
    });
  } catch (error) {
    console.error("Failed when verifying the QuestFactory contract", error);
  }

  exportContractResult(network, "Quest", {
    address: deployResult.address,
    abi: deployResult.abi,
  });

  return deployResult;
};
export const tags = ["QuestFactory"];
