import { Artifact, HardhatRuntimeEnvironment } from "hardhat/types";
// import "@nomiclabs/hardhat-etherscan";
import defaultConfig from "../default-config.json";
import exportContractResult from "../scripts/export-contract-result";
import { DeployResult } from "hardhat-deploy/dist/types";

// ZkSync support
import { Contract, Wallet } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const contractName = "QuestFactory";

export default async (
  hre: HardhatRuntimeEnvironment,
  args?: {
    governAddress: string;
    createDepositToken: string;
    createDepositAmount: number;
    playDepositToken: string;
    playDepositAmount: number;
  }
) => {
  const { deploy } = hre.deployments;
  const { deployer, govern, owner } = await hre.getNamedAccounts();

  const createDeposit = args
    ? { token: args.createDepositToken, amount: args.createDepositAmount }
    : defaultConfig.CreateQuestDeposit[hre.network.name];
  const playDeposit = args
    ? { token: args.playDepositToken, amount: args.playDepositAmount }
    : defaultConfig.PlayQuestDeposit[hre.network.name];
  const constructorArguments = [
    args?.governAddress ?? govern,
    createDeposit.token,
    hre.ethers.utils.parseEther(createDeposit.amount.toString()),
    playDeposit.token,
    hre.ethers.utils.parseEther(playDeposit.amount.toString()),
    owner,
  ];

  console.log({ constructorArguments });

  let deployResult: Contract | DeployResult;
  if (hre.network.zksync) {
    console.log("Deploying QuestFactory on zkSync...", { deployer });
    // Initialize the wallet.
    const wallet = new Wallet(deployer);
    console.log("Wallet initialized", { wallet });
    // Create deployer object and load the artifact of the contract we want to deploy.
    const zkDeployer = new Deployer(hre, wallet);
    console.log("Deployer initialized", { zkDeployer });
    // Load contract
    console.log("Loading contract...", { zkDeployer });
    const artifact = await zkDeployer.loadArtifact(contractName);
    console.log("Deploying contract...", { artifact });
    deployResult = await zkDeployer.deploy(artifact, constructorArguments);
    console.log("Deploying succeed", { deployResult });
  } else {
    deployResult = await deploy(contractName, {
      from: deployer,
      args: constructorArguments,
      log: true,
      // gasLimit: 4000000,
    });
  }

  await hre.ethers.getContract(contractName, deployResult.address);

  try {
    console.log("Verifying QuestFactory...");
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
    console.error("Failed when verifying the QuestFactory contract", error);
  }

  exportContractResult(hre.network, contractName, {
    address: deployResult.address,
    abi: deployResult.abi,
  });

  return deployResult;
};
export const tags = [contractName];
