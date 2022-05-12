import { Network } from "hardhat/types";
import fs from "fs";

type ContractsJson = { address: string; abi: string[] };
export default function exportContractResult(
  network: Network,
  contractName: string,
  contractValue: ContractsJson
) {
  const path = "../react-app/src/contracts/hardhat_contracts.json";
  const hardhatContracts = fs.readFileSync(path);
  hardhatContracts[network.config.chainId][network.name].contracts[
    contractName
  ] = contractValue;
  fs.writeFileSync(path, JSON.stringify(hardhatContracts, null, 2));
}
