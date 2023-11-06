import { HardhatRuntimeEnvironment } from "hardhat/types";

export const verifyContractWithRetry = (
  name: string,
  run: HardhatRuntimeEnvironment["run"],
  address: string,
  constructorArguments: any[],
  triesRemaining = 2
) =>
  new Promise((resolve, reject) => {
    if (triesRemaining === 2) {
      console.log(`Verifying ${name}...`);
    } else if (triesRemaining === 1) {
      reject(`Failed to verify ${name}. No more tries remaining.`);
    }
    setTimeout(
      () =>
        run("verify:verify", {
          address: address,
          constructorArguments: constructorArguments,
        })
          .then(resolve)
          .catch((error) => {
            console.error(
              `Failed when verifying the ${name} contract, retrying (${triesRemaining--} more tries)`,
              error
            );

            verifyContractWithRetry(
              name,
              run,
              address,
              constructorArguments,
              triesRemaining
            )
              .then(resolve)
              .catch(reject);
          }),
      30000
    );
  });
