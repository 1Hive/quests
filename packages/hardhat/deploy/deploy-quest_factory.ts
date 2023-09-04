import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import defaultConfig from "../default-config.json";
import exportContractResult from "../scripts/export-contract-result";

export const buildQuestFactoryConstructorArguments = async ({
  getNamedAccounts,
  args,
  network,
  ethers,
}) => {
  const { govern, owner } = await getNamedAccounts();
  const createDeposit = args
    ? { token: args.createDepositToken, amount: args.createDepositAmount }
    : defaultConfig.CreateQuestDeposit[network.name];
  console.log(network.name);
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

  try {
    console.log("Verifying QuestFactory...");
    await new Promise((res, rej) => {
      setTimeout(
        () =>
          run("verify:verify", {
            address: deployResult.address,
            constructorArguments: [],
          })
            .then(res)
            .catch(rej),
        30000
      ); // Wait for contract to be deployed
    });
  } catch (error) {
    console.error("Failed when verifying the QuestFactory contract", error);
  }

  exportContractResult(network, "QuestFactory", {
    address: deployResult.address,
    abi: abi,
  });

  return deployResult;
};
export const tags = ["QuestFactory"];
