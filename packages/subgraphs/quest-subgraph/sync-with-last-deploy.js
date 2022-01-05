const network = process.argv.slice(2)[0];
console.log(network);
const QuestFactory = require(`../../hardhat/deployments/${network}/QuestFactory.json`);
const ConfigJson = require(`./config/${network}.json`);
const yaml = require("js-yaml");
const fs = require("fs");

try {
  fs.writeFileSync(
    "./abis/QuestFactory.json",
    JSON.stringify(QuestFactory.abi)
  );
  //file written successfully
} catch (err) {
  console.error(err);
}

// Fetch last contract address for rinkeby
try {
  ConfigJson.questFactoryAddress = QuestFactory.address;
  fs.writeFileSync(`./config/${network}.json`, JSON.stringify(ConfigJson));
  //file written successfully
} catch (err) {
  console.error(err);
}
