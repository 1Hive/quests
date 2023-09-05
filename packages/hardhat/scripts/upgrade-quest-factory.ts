import { HardhatRuntimeEnvironment } from "hardhat/types";
import { buildQuestFactoryConstructorArguments } from "../deploy/deploy-quest_factory";
import exportContractResult from "../scripts/export-contract-result";

export default async function upgradeQuestFactory(
  {
    network,
    ethers,
    upgrades,
    getNamedAccounts,
    run,
  }: HardhatRuntimeEnvironment,
  args?: {
    governAddress: string;
    createDepositToken: string;
    createDepositAmount: number;
    playDepositToken: string;
    playDepositAmount: number;
  }
) {
  const QuestFactoryProxy = require(`../deployments/${network.name}/QuestFactory.json`);
  const abi =
    require(`../artifacts/contracts/QuestFactory.sol/QuestFactory.json`).abi;

  const constructorArguments = buildQuestFactoryConstructorArguments({
    getNamedAccounts,
    args,
    network,
    ethers,
  });

  const contractFactory = await ethers.getContractFactory("QuestFactory");
  const newContractUpgrade = await upgrades.upgradeProxy(
    QuestFactoryProxy.address,
    contractFactory
  );
  newContractUpgrade.deployed();

  console.log({ constructorArguments });

  try {
    console.log("Verifying QuestFactory...");
    await new Promise((res, rej) => {
      setTimeout(
        () =>
          run("verify:verify", {
            address: newContractUpgrade.address,
            constructorArguments: [],
          })
            .then(res)
            .catch(rej),
        30000
      ); // Wait for contract to be deployed
    });
  } catch (error) {
    console.error("Failed when verifying the Quest contract", error);
  }

  exportContractResult(network, "QuestFactory", {
    address: QuestFactoryProxy.address,
    abi: abi,
  });

  return newContractUpgrade.address;
}
