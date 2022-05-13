import { Network } from "hardhat/types";
import hardhatContracts from "../../react-app/src/contracts/hardhat_contracts.json";
import fs from "fs";

type ContractsJson = { address: string; abi: string[] };
export default function exportContractResult(
  network: Network,
  contractName: string,
  contractValue: ContractsJson
) {
  const path = "../react-app/src/contracts/hardhat_contracts.json";
  try {
    hardhatContracts[network.config.chainId][network.name].contracts[
      contractName
    ] = contractValue;
    fs.writeFileSync(path, JSON.stringify(hardhatContracts, null, 2));
  } catch (error) {
    console.error(
      `[${contractName}]Error during publishing deployement result into ${path}`,
      error
    );
  }
}
