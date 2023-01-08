import { Network } from "hardhat/types";
import hardhatContracts from "../../react-app/src/contracts/hardhat_contracts.json";
import fs from "fs";

type ContractsJson = { address: string; abi: string[] };
export default function exportContractResult(
  network: Network,
  contractName: string,
  contractValue: ContractsJson
) {
  // Export to hardhat single file
  try {
    fs.writeFileSync(
      `./deployments/${network.name}/${contractName}.json`,
      JSON.stringify({
        address: contractValue.address,
        abi: contractValue.abi,
      })
    );
  } catch (error) {
    console.error(
      "Error during publishing deployement result into GovernQueue.json",
      error
    );
  }
  const path = "../react-app/src/contracts/hardhat_contracts.json";
  try {
    let arrayMaybe =
      hardhatContracts[network.config.chainId][network.name].contracts[
        contractName
      ];
    if (Array.isArray(arrayMaybe)) {
      arrayMaybe.push(contractValue);
    } else {
      hardhatContracts[network.config.chainId][network.name].contracts[
        contractName
      ] = contractValue;
    }
    fs.writeFileSync(path, JSON.stringify(hardhatContracts, null, 2));
  } catch (error) {
    console.error(
      `[${contractName}] Error during publishing deployement result into ${path}`,
      error
    );
  }
}
