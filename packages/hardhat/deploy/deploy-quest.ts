import { HardhatRuntimeEnvironment } from "hardhat/types";
import exportContractResult from "../scripts/export-contract-result";

export const questConstructorArguments = [
  "ASDF",
  "0x00",
  {
    token: "0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd",
    amount: "100000000000000000",
  },
  {
    token: "0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd",
    amount: "100000000000000000",
  },
  {
    questCreator: "0xdf456B614fE9FF1C7c0B380330Da29C96d40FB02",
    maxPlayers: 0,
    rewardToken: "0xdf456B614fE9FF1C7c0B380330Da29C96d40FB02",
    expireTime: 1700122574,
    aragonGovernAddress: "0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd",
    fundsRecoveryAddress: "0xdf456B614fE9FF1C7c0B380330Da29C96d40FB02",
    isWhiteList: false,
  },
];

// Not actually used but so verification using etherscan-verify will verify the quest contract
export default async ({
  getNamedAccounts,
  deployments,
  network,
  run,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployResult = await deploy("Quest", {
    from: deployer,
    args: questConstructorArguments,
    log: true,
    // gasLimit: 30000000,
  });

  console.log({ questConstructorArguments });

  exportContractResult(network, "Quest", {
    address: deployResult.address,
    abi: deployResult.abi,
  });

  return deployResult;
};
export const tags = ["Quest"];
