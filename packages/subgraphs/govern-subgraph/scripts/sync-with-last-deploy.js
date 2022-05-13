const network = process.argv.slice(2)[0];
const GovernQueue = require(`../../../hardhat/deployments/${network}/GovernQueue.json`);
const ConfigJson = require(`../manifest/data/${network}.json`);
const fs = require("fs");

try {
  fs.writeFileSync(
    "./govern-core/abi/contracts/pipelines/GovernQueue.sol/GovernQueue.json",
    JSON.stringify(GovernQueue.abi)
  );
  //file written successfully
} catch (err) {
  console.error(err);
}

// Fetch last contract address for rinkeby
try {
  ConfigJson.governQueueAddress = GovernQueue.address;
  fs.writeFileSync(
    `./manifest/data/${network}.json`,
    JSON.stringify(ConfigJson)
  );
  //file written successfully
} catch (err) {
  console.error(err);
}
