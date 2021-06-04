/* eslint no-use-before-define: "warn" */
const { ethers, run } = require("hardhat");

const main = async () => {
  await run("compile");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const QuestFactory = await ethers.getContractFactory("QuestFactory");
  const questFactory = await (await QuestFactory.deploy()).deployed();

  console.log("QuestFactory address:", questFactory.address);

  await run("verify:verify", {
    address: questFactory.address,
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
