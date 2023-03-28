import { HardhatRuntimeEnvironment } from "hardhat/types";

// ZkSync support
import { Contract, Wallet, utils } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { DeployFunction } from "hardhat-deploy/dist/types";

const contractName = "HoneyTestToken";
let verificationContractName = contractName;

const deployment: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // console.log("PRIVATE_KEY", process.env.PRIVATE_KEY);
  // const { deploy } = hre.deployments;
  // const { deployer, owner } = await hre.getNamedAccounts();

  const constructorArguments = [];

  // if (hre.network.zksync) {
  verificationContractName = "contracts/HoneyTestToken.sol:HoneyTestToken";
  // console.log("Deploying HoneyTest on zkSync...", { deployer });
  const wallet = new Wallet(process.env.PRIVATE_KEY);
  console.log("Wallet initialized");
  const zkDeployer = new Deployer(hre, wallet);
  console.log("Deployer initialized");

  const tokenArtifact = await zkDeployer.loadArtifact(contractName);
  console.log("TokenArtifact loaded");

  //   // Deposit ETH to zkSync
  //   const depositAmount = ethers.utils.parseEther("0.001");
  //   console.log("Estimating fee and gas...");
  //   const estimatedFee = await zkDeployer.estimateDeployFee(
  //     tokenArtifact,
  //     constructorArguments
  //   );
  //   const estimatedGas = await zkDeployer.estimateDeployGas(
  //     tokenArtifact,
  //     constructorArguments
  //   );
  //   const deployerBalance = await zkDeployer.zkWallet.getBalance(
  //     utils.ETH_ADDRESS
  //   );
  //   console.log("Actual state and estimations", {
  //     balance: deployerBalance.toString(),
  //     depositAmount: depositAmount.toString(),
  //     estimatedFee: estimatedFee.toString(),
  //     estimatedGas: estimatedGas.toString(),
  //   });
  //   if (deployerBalance.lt(depositAmount.add(estimatedFee).add(estimatedGas))) {
  //     console.log("Depositing ETH to zkSync...");
  //     const depositHandle = await zkDeployer.zkWallet.deposit({
  //       to: zkDeployer.zkWallet.address,
  //       token: utils.ETH_ADDRESS,
  //       amount: depositAmount,
  //     });
  //     await depositHandle.wait();
  //     console.log("ETH deposited", { depositHandle });
  //   } else {
  //     console.log("Enough ETH already deposited");
  //   }

  //   // Deploy TokenFactory
  //   console.log("Deploying contract...", {
  //     contract: tokenArtifact.contractName,
  //   });
  const token = await zkDeployer.deploy(tokenArtifact, []);
  console.log("Deploying succeed", { address: token.address });
  // } else {
  //   // Deploy TokenController
  //   const result = await deploy(contractName, {
  //     from: deployer,
  //     args: constructorArguments,
  //     log: true,
  //   });

  //   token = new Contract(result.address, result.abi, hre.ethers.provider);
  // }

  // console.log("Transferring ownership to", owner);
  // await token.transferOwnership(owner);

  // try {
  //   console.log("Verifying HoneyTest...");
  //   await new Promise((res, rej) => {
  //     setTimeout(() => {
  //       hre
  //         .run("verify:verify", {
  //           address: token.address,
  //           contract: verificationContractName,
  //           constructorArguments,
  //         })
  //         .then(res)
  //         .catch(rej);
  //     }, 30000); // Wait for contract to be deployed
  //   });
  // } catch (error) {
  //   console.error(`Failed when verifying the ${contractName} contract`, error);
  // }

  // exportContractResult(hre.network, contractName, {
  //   address: token.address,
  //   abi: token.abi,
  // });

  try {
    const address = token.address;
    console.log("Verifying HoneyTest...");
    await hre.run("verify:verify", {
      address: address,
      contract: verificationContractName,
      constructorArguments,
    });
  } catch (error) {
    console.error(`Failed when verifying the ${contractName} contract`, error);
  }
};
deployment.tags = [contractName];

export default deployment;
