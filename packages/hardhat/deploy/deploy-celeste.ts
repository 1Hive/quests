import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import defaultConfig from "../default-config.json";
import exportContractResult from "../scripts/export-contract-result";

export default async ({
  getNamedAccounts,
  deployments,
  ethers,
  network,
  run,
}: HardhatRuntimeEnvironment) => {
  const { deployer, owner } = await getNamedAccounts();
  const constructorArguments = [
    defaultConfig.ChallengeFee[network.name].token,
    ethers.utils.parseEther(
      defaultConfig.ChallengeFee[network.name].amount.toString()
    ),
  ];
  const result = await deployments.deploy("OwnableCeleste", {
    from: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    args: constructorArguments,
    gasLimit: 10000000,
  });
  console.log("Deployed Celeste (" + network.name + "):", result.address);
  const contract = await ethers.getContractAt(result.abi, result.address);
  //   await contract.setOwner(owner, { from: deployer, gasLimit: 500000 });
  console.log("Ownership transfered to: ", owner);
  exportContractResult(network, "Celeste", result);

  try {
    console.log("Verifying OwnableCeleste...");
    await new Promise((res, rej) => {
      setTimeout(async () => {
        Promise.all([
          run("verify:verify", {
            address: result.address,
            constructorArguments,
          }),
        ])
          .then(res)
          .catch(rej);
      }, 2000); // Wait for contract to be deployed
    });
  } catch (error) {
    console.error("Failed when verifying OwnableCeleste contract", error);
  }
};
export const tags = ["OwnableCeleste", "DisputeManager"];
