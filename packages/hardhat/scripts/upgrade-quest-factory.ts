import { HardhatRuntimeEnvironment } from "hardhat/types";
import { buildQuestFactoryConstructorArguments } from "../deploy/deploy-quest_factory";
import exportContractResult from "../scripts/export-contract-result";
import { verifyContractWithRetry } from "../scripts/verify-contract";

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
    newProxy: boolean;
  }
) {
  const QuestFactoryProxy = require(`../deployments/${network.name}/QuestFactory.json`);
  const abi =
    require(`../artifacts/contracts/QuestFactory.sol/QuestFactory.json`).abi;

  const { govern } = await getNamedAccounts();

  const contractFactory = await ethers.getContractFactory("QuestFactory");
  const newContractUpgrade = await upgrades.upgradeProxy(
    QuestFactoryProxy.address,
    contractFactory
  );
  await newContractUpgrade.deployed();

  exportContractResult(network, "QuestFactory", {
    address: QuestFactoryProxy.address,
    abi: abi,
  });

  return { address: newContractUpgrade.address, args: [] };
}
