import { DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import exportContractResult from "../scripts/export-contract-result";

// ZkSync support
import { Contract, Wallet } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const contractName = "HoneyTest";

// Not actually used but so verification using etherscan-verify will verify the quest contract
export default async (hre: HardhatRuntimeEnvironment) => {
  console.log("PRIVATE_KEY", process.env.PRIVATE_KEY);
  const { deploy } = hre.deployments;
  const { deployer, owner } = await hre.getNamedAccounts();

  let token: Contract;
  let tokenController: Contract;
  let tokenFactory: DeployResult | Contract;

  const constructorArguments = [
    "0x0000000000000000000000000000000000000000",
    1,
    "Honey test",
    18,
    "HNYT",
    true,
  ];

  if (hre.network.zksync) {
    const wallet = new Wallet(deployer);
    const zkDeployer = new Deployer(hre, wallet);
    // Deploy TokenFactory
    const tokenFactoryArtifact = await zkDeployer.loadArtifact(
      "MiniMeTokenFactory"
    );
    tokenFactory = await zkDeployer.deploy(tokenFactoryArtifact, []);

    // Deploy TokenController
    const tokenControllerArtifact = await zkDeployer.loadArtifact(
      "TokenController"
    );
    tokenController = await zkDeployer.deploy(tokenControllerArtifact, [owner]);
    // Deploy TokenController
    const miniMeTokenArtifact = await zkDeployer.loadArtifact("MiniMeToken");
    token = await zkDeployer.deploy(miniMeTokenArtifact, [
      tokenFactory.address,
      ...constructorArguments,
    ]);
  } else {
    // Deploy TokenController
    tokenFactory = await deploy("MiniMeTokenFactory", {
      from: deployer,
      args: [],
      log: true,
    });
    // Deploy TokenController
    const tokenControllerResult = await deploy("TokenController", {
      from: deployer,
      args: [owner],
      log: true,
    });
    tokenController = new Contract(
      tokenControllerResult.address,
      tokenControllerResult.abi,
      hre.ethers.provider
    );
    // Deploy TokenController
    const result = await deploy("MiniMeToken", {
      from: deployer,
      args: [tokenFactory.address, ...constructorArguments],
      log: true,
    });

    token = new Contract(result.address, result.abi, hre.ethers.provider);
  }

  // Setting controller
  token
    .changeController(tokenController.address)
    .then((tx) => {
      console.log("Successfully setting controller", tx);

      // Setting MiniMeToken owner
      token
        .transferOwnership(owner)
        .then((tx) => {
          console.log("Successfully setting token controller owner", tx);
        })
        .catch((error) => {
          console.error("Failed when setting token controller owner", error);
        });
    })
    .catch((error) => {
      console.error("Failed when setting controller", error);
    });

  // Setting controller owner
  tokenController
    .transferOwnership(owner)
    .then((tx) => {
      console.log("Successfully setting token controller owner", tx);
    })
    .catch((error) => {
      console.error("Failed when setting token controller owner", error);
    });

  try {
    console.log("Verifying HoneyTest...");
    await new Promise((res, rej) => {
      setTimeout(() => {
        hre
          .run("verify:verify", {
            address: tokenController.address,
            contract: "TokenFactory",
            constructorArguments: [owner],
          })
          .then(res)
          .catch(rej);
        hre
          .run("verify:verify", {
            address: tokenController.address,
            contract: "TokenController",
            constructorArguments: [owner],
          })
          .then(res)
          .catch(rej);
        hre
          .run("verify:verify", {
            address: token.address,
            contract: "MiniMeToken",
            constructorArguments: [
              tokenFactory.address,
              ...constructorArguments,
            ],
          })
          .then(res)
          .catch(rej);
      }, 30000); // Wait for contract to be deployed
    });
  } catch (error) {
    console.error("Failed when verifying the Quest contract", error);
  }

  exportContractResult(hre.network, contractName, {
    address: token.address,
    abi: token.abi,
  });

  return token;
};
export const tags = [contractName];
