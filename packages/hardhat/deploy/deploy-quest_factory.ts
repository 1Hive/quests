module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer, govern } = await getNamedAccounts();
  await deploy("QuestFactory", {
    from: deployer,
    args: [
      govern,
      "0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd",
      "100000000000000000",
    ],
    log: true,
  });
};
module.exports.tags = ["QuestFactory"];
