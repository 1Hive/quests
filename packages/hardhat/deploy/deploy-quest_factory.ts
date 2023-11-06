import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import defaultConfig from "../default-config.json";
import exportContractResult from "../scripts/export-contract-result";
import { verifyContractWithRetry } from "../scripts/verify-contract";

export const buildQuestFactoryConstructorArguments = async ({
  getNamedAccounts,
  args,
  network,
  ethers,
}) => {
  const { govern, owner } = await getNamedAccounts();
  const createDeposit = args.createDepositToken
    ? { token: args.createDepositToken, amount: args.createDepositAmount }
    : defaultConfig.CreateQuestDeposit[network.name];
  console.log(network.name);
  const playDeposit = args.playDepositToken
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
  return constructorArguments;
};

export default async (
  {
    getNamedAccounts,
    ethers,
    network,
    run,
    upgrades,
  }: HardhatRuntimeEnvironment,
  args?: {
    governAddress: string;
  }
) => {
  const constructorArguments = await buildQuestFactoryConstructorArguments({
    getNamedAccounts,
    args,
    network,
    ethers,
  });
  const abi =
    require(`../artifacts/contracts/QuestFactory.sol/QuestFactory.json`).abi;
  var contractFactory = await ethers.getContractFactory("QuestFactory");
  var deployResult = await upgrades.deployProxy(
    contractFactory,
    constructorArguments,
    { initializer: "initialize" }
  );
  deployResult.deployed();
  await ethers.getContractAt("QuestFactory", deployResult.address);

  exportContractResult(network, "QuestFactory", {
    address: deployResult.address,
    abi: abi,
  });

  await verifyContractWithRetry(
    "QuestFactory",
    run,
    deployResult.address,
    [] // Proxy doens't have constructor arguments
  );

  return deployResult;
};
export const tags = ["QuestFactory"];
