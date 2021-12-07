const QuestFactoryRinkeby = require("../hardhat/deployments/rinkeby/QuestFactory.json");
const ConfigJson = require("./config/rinkeby.json");
const yaml = require("js-yaml");
const fs = require("fs");

// Fetch last abi for rinkeby
try {
  fs.writeFileSync(
    "./abis/QuestFactory.json",
    JSON.stringify(QuestFactoryRinkeby.abi)
  );
  //file written successfully
} catch (err) {
  console.error(err);
}

// Fetch last contract address for rinkeby
try {
  ConfigJson.contractAddress = QuestFactoryRinkeby.address;
  fs.writeFileSync("./config/rinkeby.json", JSON.stringify(ConfigJson));
  //file written successfully
} catch (err) {
  console.error(err);
}
