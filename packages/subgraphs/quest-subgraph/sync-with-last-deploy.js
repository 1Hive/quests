/* 
Need run Hardhat and get the lastdeployment, 
check if it already have some file in the path, 
if it exist so check if in subgraph abi also exist the 
same exatcly file.
If the exactly file exist check the name and extract 
the version, lastVersion.



*/
import fs from "fs";
import minimist from "minimist";
import inquirer from "inquirer";

const DEFAULT_NETWORK = "localhost";

var argv = minimist(process.argv.slice(2));
console.log(argv);

import Configstore from "configstore";
import { spawn } from "child_process";
import { exit } from "process";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

// Create a Configstore instance.
const config = new Configstore(packageJson.name, { foo: "bar" });

let network = argv["_"][0] || argv["network"] || argv["n"]; //network
let versionNumber = argv["_"][1] || argv["version"] || argv["v"]; //num version

if (network) {
  config.set("network", network);
} else {
  if (config.has("network")) {
    network = config.get("network");
  } else {
    console.warn("Warning: Using localhost as network");
    network = DEFAULT_NETWORK;
  }
}
if (versionNumber) {
  config.set("versionNumber", versionNumber);
} else {
  if (config.has("versionNumber")) {
    versionNumber = config.get("versionNumber");
  } else {
    console.warn("Warning: versionNumber is not informed (eg: ./sync -v V1)");
    versionNumber = "";
  }
}

console.log("network", network);
console.log("versionNumber", versionNumber);

const DEFAULT_CHOICES = [
  { name: "No thanks", value: false },
  { name: "Oh Yeah!", value: true },
];

const DEFAULT_LIST_PROMPT = {
  type: "list",
  name: "isContinue",
  message: "Check the network and version, want continue?",
  choices: DEFAULT_CHOICES,
};

const folderAbove = (path)=>{
  return path.replace(/\/[^\/]+\/?$/, '')
}
const promptList = ({ name, message }) => {
  return inquirer.prompt({ ...DEFAULT_LIST_PROMPT, name, message });
};

const { isContinue } = await promptList({
  name: "isContinue",
  message: "Check the network and version, want continue?",
});

if (!isContinue) {
  console.log("Cya! Coming back soon!");
  exit(0);
}

const hardhatDeployment = `../../hardhat/deployments/${network}/QuestFactory.json`;

if (fs.existsSync(hardhatDeployment)) {
  runMain();
} else {
  console.log("Error: You need run yarn deploy in hardhat folder");
  const { isRunHardhatDeploy } = await promptList({
    name: "isRunHardhatDeploy",
    message: "Want run hardhat deploy?",
  });
  console.log(isRunHardhatDeploy);
  if (isRunHardhatDeploy) {
    try {
      const result = await runHardhatDeploy();
      if (!result){
        throw new Error('False!')
      }
      runMain();
    } catch (error) {
      console.log("Some error. I can't continue.");
    }
  } else {
    console.log("I can't continue. Generate the files needed first.");
  }
}

async function runHardhatDeploy() {
  return new Promise((res,reject)=>{
    
  const yarnSpawn = spawn("yarn", ["run","hardhat:deploy:local"]);
  yarnSpawn.stdout.on("data", (data) => {
    console.log(`[yo]: ${data}`);
  });
  yarnSpawn.stderr.on("data", (data) => {
     console.error(`[yerr]: ${data}`);
    reject(`${data}`)
  });
  yarnSpawn.on("close", (code) => {
    console.log(`[yclose]: ${code}`);
    res(!Boolean(code))
  });
  })
}

function loadJson(path) {
  if (!path) {
    throw new Error("LoadJson->Path need be defined");
  }
  if (!fs.existsSync(path)) {
    throw new Error("LoadJson->File in path not exist");
  }
  return JSON.parse(fs.readFileSync(path));
}

async function runMain() {

  let includeVersionNumber = "";
  if (versionNumber) {
    includeVersionNumber = `${versionNumber}`;
  }

  try {
    const abiPathJson = `./abis/QuestFactory${includeVersionNumber}.json`;
    if (fs.existsSync(abiPathJson)) {
      const { isDeployNewVersion } = await promptList({
        name: "isDeployNewVersion",
        message: `ABI file at (${abiPathJson}) already exist, want increment new version`,
      });
      console.log(isDeployNewVersion);
      if (isDeployNewVersion) {
        runABINewVersion({abiPathJson});
      } else {
        console.log("I'll do nothing");
      }
    }
  } catch (err) {
    console.error(err);
  }

  async function runABINewVersion({abiPathJson}) {
    const QuestFactory = await loadJson(hardhatDeployment);
    try {

      fs.writeFileSync(
        abiPathJson,
        JSON.stringify(QuestFactory.abi, undefined, 4)
      );
      //file written successfully
    } catch (err) {
      console.error(err);
    }
    
    // Fetch last contract address for rinkeby
    try {
      const ConfigJson = loadJson(`./config/${network}.json`);
      ConfigJson.questFactoryAddress = QuestFactory.address;
      fs.writeFileSync(`./config/${network}.json`, JSON.stringify(ConfigJson,undefined,4));
      //file written successfully
    } catch (err) {
      console.error(err);
    }
  }
}
