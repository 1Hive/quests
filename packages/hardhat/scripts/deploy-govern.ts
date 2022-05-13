import { HardhatRuntimeEnvironment } from "hardhat/types";
import GovernFactoryAbi from "../abi/contracts/Externals/GovernFactory.json";
import fs from "fs";
import exportContractResult from "./export-contract-result";
import GovernAbi from "../abi/contracts/Externals/Govern.json";

export default async function deployGovern(
  args: { initialExecutorAddress: string; governFactoryAddress: string },
  { network, ethers }: HardhatRuntimeEnvironment
) {
  const governFactory = await ethers.getContractAt(
    GovernFactoryAbi,
    args.governFactoryAddress
  );
  const tx = await governFactory.newGovern(
    args.initialExecutorAddress,
    ethers.constants.HashZero,
    {
      gasPrice: "5000000000",
    }
  );
  console.log("Deploying Govern... tx:", tx.hash);
  const res = await tx.wait();
  const newGovernAddress = res.logs[0].address;
  console.log("Deployed govern (" + network.name + "): ", newGovernAddress);
  try {
    fs.writeFileSync(
      "./deployments/" + network.name + "/Govern.json",
      JSON.stringify({
        address: newGovernAddress,
        abi: GovernAbi,
      })
    );
  } catch (error) {
    console.error(
      "Error during publishing deployement result into Govern.json",
      error
    );
  }
  exportContractResult(network, "Govern", {
    address: newGovernAddress,
    abi: GovernAbi as [],
  });
  return newGovernAddress;
}
