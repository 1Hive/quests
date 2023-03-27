import { DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import exportContractResult from "../scripts/export-contract-result";

// ZkSync support
import { Contract, Wallet } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const contractName = "OwnableCelesteMock";

// Not actually used but so verification using etherscan-verify will verify the quest contract
export default async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const constructorArguments = [
    "ASDF",
    "0x00",
    "0xdf456B614fE9FF1C7c0B380330Da29C96d40FB02",
    1700122574,
    "0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd",
    "0xdf456B614fE9FF1C7c0B380330Da29C96d40FB02",
    {
      token: "0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd",
      amount: "100000000000000000",
    },
    {
      token: "0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd",
      amount: "100000000000000000",
    },
    "0xdf456B614fE9FF1C7c0B380330Da29C96d40FB02",
    0,
  ];
  console.log({ constructorArguments });

  let deployResult: DeployResult | Contract;
  if (hre.network.zksync) {
    // Initialize the wallet.
    const wallet = new Wallet(deployer);
    // Create deployer object and load the artifact of the contract we want to deploy.
    const zkDeployer = new Deployer(hre, wallet);
    // Load contract
    const artifact = await zkDeployer.loadArtifact(contractName);
    deployResult = await zkDeployer.deploy(artifact, constructorArguments);
  } else {
    deployResult = await deploy(contractName, {
      from: deployer,
      args: constructorArguments,
      log: true,
      // gasLimit: 4000000,
    });
  }

  try {
    console.log("Verifying Quest...");
    await new Promise((res, rej) => {
      setTimeout(
        () =>
          hre
            .run("verify:verify", {
              address: deployResult.address,
              contract: contractName,
              constructorArguments,
            })
            .then(res)
            .catch(rej),
        30000
      ); // Wait for contract to be deployed
    });
  } catch (error) {
    console.error("Failed when verifying the Quest contract", error);
  }

  exportContractResult(hre.network, contractName, {
    address: deployResult.address,
    abi: deployResult.abi,
  });

  return deployResult;
};
export const tags = [contractName];
