const network = process.argv.slice(2)[0]; //network
const versionNumber = process.argv.slice(2)[1]; //num version

const QuestFactory = require(`../../hardhat/deployments/${network}/QuestFactory.json`);
const ConfigJson = require(`./config/${network}.json`);
const yaml = require("js-yaml");
const fs = require("fs");

let includeVersionNumber = ''
if (versionNumber){
  includeVersionNumber = `${versionNumber}`
}

try {
  fs.writeFileSync(
    `./abis/QuestFactory${includeVersionNumber}.json`,
    JSON.stringify(QuestFactory.abi, undefined, 4)
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
