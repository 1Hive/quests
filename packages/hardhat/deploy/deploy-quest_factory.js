module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer, govern } = await getNamedAccounts();
  await deploy("QuestFactory", {
    from: deployer,
    args: [govern],
    log: true,
  });
};
module.exports.tags = ["QuestFactory"];
