import { HardhatRuntimeEnvironment } from "hardhat/types";

// Not actually used but so verification using etherscan-verify will verify the quest contract
module.exports = async ({
  getNamedAccounts,
  deployments,
  network,
  run,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const constructorArguments = [
    "ASDF",
    "0x00",
    "0xdf456B614fE9FF1C7c0B380330Da29C96d40FB02",
    0,
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
  const deployResult = await deploy("Quest", {
    from: deployer,
    args: constructorArguments,
    log: true,
    gasLimit: 4000000,
  });

  if (network.name === "rinkeby" || network.name === "goerli") {
    try {
      console.log("Verifying Quest...");
      await new Promise((res, rej) => {
        setTimeout(
          () =>
            run("verify:verify", {
              address: deployResult.address,
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
  }
};
module.exports.tags = ["Quest"];
