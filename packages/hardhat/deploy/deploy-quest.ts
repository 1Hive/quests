// Not actually used but so verification using etherscan-verify will verify the quest contract
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer, govern } = await getNamedAccounts();
  await deploy("Quest", {
    from: deployer,
    args: ["ASDF", "0x00", "0xdf456B614fE9FF1C7c0B380330Da29C96d40FB02", 0, "0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd", "0xdf456B614fE9FF1C7c0B380330Da29C96d40FB02"],
    log: true,
  });
};
module.exports.tags = ["Quest"];
