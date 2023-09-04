import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import fs from "fs";
import chalk from "chalk";
import "@tenderly/hardhat-tenderly";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "hardhat-typechain";
import "typechain";
import "solidity-coverage";
import { task, HardhatUserConfig, types } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types";
import { resolve } from "path";
import deployQuest from "./deploy/deploy-quest";
import deployGovernQueue, {
  generateQueueConfig,
} from "./scripts/deploy-govern_queue";
import deployGovern from "./scripts/deploy-govern";
import governGnosis from "./deployments/xdai/Govern.json";
import governGoerli from "./deployments/goerli/Govern.json";
import defaultConfig from "./default-config.json";
import exportContractResult from "./scripts/export-contract-result";
import GovernAbi from "./abi/contracts/Externals/Govern.json";
import GovernQueueAbi from "./abi/contracts/Externals/GovernQueue.json";
import CelesteMockGoerli from "./deployments/goerli/OwnableCeleste.json";
import upgradeQuestFactory from "./scripts/upgrade-quest-factory";

dotenvConfig({
  path: resolve(
    __dirname + "/../../",
    fs.readdirSync("../../").filter((allFilesPaths: string) => {
      let result = allFilesPaths.match(/\.env$/) !== null;
      return result;
    })[0]
  ),
});

//
// Select the network you want to deploy to here:
//
const defaultNetwork = "localhost";
const mainnetGwei = 21;
function mnemonic() {
  try {
    if (!process.env.MNEMONIC || !process.env.PRIVATE_KEY)
      throw new Error("No mnemonic detected");
    return process.env.MNEMONIC;
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.warn(
        "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
      );
    }
  }

  return "test test test test test test test test test test test junk";
}

function getAccounts() {
  if (process.env.PRIVATE_KEY) {
    return [process.env.PRIVATE_KEY as any];
  }

  return {
    mnemonic: mnemonic(),
  };
}

const hardhatConfig: HardhatUserConfig = {
  defaultNetwork,

  // don't forget to set your provider like:
  // REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
  // (then your frontend will talk to your contracts on the live network!)
  // (you will need to restart the `yarn run start` dev server after editing the .env)

  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337,
      /*
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      */
    },
    rinkeby: {
      chainId: 4,
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_ID, // <---- YOUR INFURA ID! (or it won't work)
      accounts: getAccounts(),
      gasPrice: 40000000000,
    },
    kovan: {
      url: "https://kovan.infura.io/v3/" + process.env.INFURA_ID, // <---- YOUR INFURA ID! (or it won't work)
      accounts: getAccounts(),
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + process.env.INFURA_ID, // <---- YOUR INFURA ID! (or it won't work)
      accounts: getAccounts(),
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/" + process.env.INFURA_ID, // <---- YOUR INFURA ID! (or it won't work)
      accounts: getAccounts(),
    },
    goerli: {
      chainId: 5,
      url: "https://eth-goerli.g.alchemy.com/v2/E6EdrejZ7PPswowaPl3AfLkdFGEXm1PJ",
      accounts: getAccounts(),
      gasPrice: 20000000000, // 20 Gwei
    },
    xdai: {
      chainId: 100,
      url: "https://rpc.gnosischain.com/",
      accounts: getAccounts(),
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com/",
      gasPrice: 1000000000,
      accounts: getAccounts(),
    },
    rinkebyArbitrum: {
      url: "https://rinkeby.arbitrum.io/rpc",
      gasPrice: 0,
      accounts: getAccounts(),
      companionNetworks: {
        l1: "rinkeby",
      },
    },
    localArbitrum: {
      url: "http://localhost:8547",
      gasPrice: 0,
      accounts: getAccounts(),
      companionNetworks: {
        l1: "localArbitrumL1",
      },
    },
    localArbitrumL1: {
      url: "http://localhost:7545",
      gasPrice: 0,
      accounts: getAccounts(),
      companionNetworks: {
        l2: "localArbitrum",
      },
    },
    kovanOptimism: {
      url: "https://kovan.optimism.io",
      gasPrice: 0,
      accounts: getAccounts(),
      companionNetworks: {
        l1: "kovan",
      },
    },
    localOptimism: {
      url: "http://localhost:8545",
      gasPrice: 0,
      accounts: getAccounts(),
      companionNetworks: {
        l1: "localOptimismL1",
      },
    },
    localOptimismL1: {
      url: "http://localhost:9545",
      gasPrice: 0,
      accounts: getAccounts(),
      companionNetworks: {
        l2: "localOptimism",
      },
    },
    localAvalanche: {
      url: "http://localhost:9650/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43112,
      accounts: getAccounts(),
    },
    fujiAvalanche: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: getAccounts(),
    },
    mainnetAvalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: getAccounts(),
    },
    testnetHarmony: {
      url: "https://api.s0.b.hmny.io",
      gasPrice: 1000000000,
      chainId: 1666700000,
      accounts: getAccounts(),
    },
    mainnetHarmony: {
      url: "https://api.harmony.one",
      gasPrice: 1000000000,
      chainId: 1666600000,
      accounts: getAccounts(),
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.5.8",
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
    ],
  },
  etherscan: {
    // @ts-ignore
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      100: process.env.DEPLOYER_ADDRESS,
      goerli: process.env.DEPLOYER_ADDRESS,
    },
    govern: {
      default: 1,
      xdai: governGnosis.address,
      goerli: governGoerli.address, // Govern address on Goerli
    },
    owner: {
      default: 1,
      xdai: defaultConfig.RootOwner.xdai,
      goerli: defaultConfig.RootOwner.goerli,
    }, // Goerli Gnosis Safe address
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

const DEBUG = false;

function debug(text) {
  if (DEBUG) {
    console.log(text);
  }
}

task("wallet", "Create a wallet (pk) link", async (_, { ethers }) => {
  const randomWallet = ethers.Wallet.createRandom();
  const privateKey = randomWallet._signingKey().privateKey;
  console.log("🔐 WALLET Generated as " + randomWallet.address + "");
  console.log("🔗 http://localhost:3000/pk#" + privateKey);
});

task("fundedwallet", "Create a wallet (pk) link and fund it with deployer?")
  .addOptionalParam(
    "amount",
    "Amount of ETH to send to wallet after generating"
  )
  .addOptionalParam("url", "URL to add pk to")

  .setAction(async (taskArgs, { network, ethers }) => {
    const randomWallet = ethers.Wallet.createRandom();
    const privateKey = randomWallet._signingKey().privateKey;
    console.log("🔐 WALLET Generated as " + randomWallet.address + "");
    const url = taskArgs.url ? taskArgs.url : "http://localhost:3000";

    let localDeployerMnemonic;
    try {
      localDeployerMnemonic = fs.readFileSync("./mnemonic.txt");
      localDeployerMnemonic = localDeployerMnemonic.toString().trim();
    } catch (e) {
      /* do nothing - this file isn't always there */
    }

    const amount = taskArgs.amount ? taskArgs.amount : "0.01";
    const tx = {
      to: randomWallet.address,
      value: ethers.utils.parseEther(amount),
    };

    // SEND USING LOCAL DEPLOYER MNEMONIC IF THERE IS ONE
    // IF NOT SEND USING LOCAL HARDHAT NODE:
    if (localDeployerMnemonic) {
      let deployerWallet = ethers.Wallet.fromMnemonic(localDeployerMnemonic);
      const signers = await ethers.getSigners();
      deployerWallet = deployerWallet.connect(signers[0].provider);
      console.log(
        "💵 Sending " +
          amount +
          " ETH to " +
          randomWallet.address +
          " using deployer account"
      );

      const sendresult = await deployerWallet.sendTransaction(tx);
      console.log("\n" + url + "/pk#" + privateKey + "\n");
      return;
    } else {
      console.log(
        "💵 Sending " +
          amount +
          " ETH to " +
          randomWallet.address +
          " using local node"
      );
      console.log("\n" + url + "/pk#" + privateKey + "\n");
      return send(ethers.provider.getSigner(), tx);
    }
  });

task(
  "generate",
  "Create a mnemonic for builder deploys",

  async (_, { ethers }) => {
    const bip39 = require("bip39");

    const hdkey = require("ethereumjs-wallet/hdkey");
    const mnemonic = bip39.generateMnemonic();
    if (DEBUG) console.log("mnemonic", mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    const fullPath = wallet_hdpath + account_index;
    if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet._privKey.toString("hex");
    if (DEBUG) console.log("privateKey", privateKey);

    const EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");
    console.log(
      "🔐 Account Generated as " +
        address +
        " and set as mnemonic in packages/hardhat"
    );
    console.log(
      "💬 Use 'yarn run account' to get more information about the deployment account."
    );

    fs.writeFileSync("./" + address + ".txt", mnemonic.toString());
    fs.writeFileSync("./mnemonic.txt", mnemonic.toString());
  }
);

task(
  "mineContractAddress",
  "Looks for a deployer account that will give leading zeros"
)
  .addParam("searchFor", "String to search for")

  .setAction(async (taskArgs, { network, ethers }) => {
    let contract_address = "";
    let address;

    const bip39 = require("bip39");

    const hdkey = require("ethereumjs-wallet/hdkey");

    let mnemonic = "";
    while (contract_address.indexOf(taskArgs.searchFor) != 0) {
      mnemonic = bip39.generateMnemonic();
      if (DEBUG) console.log("mnemonic", mnemonic);
      const seed = await bip39.mnemonicToSeed(mnemonic);
      if (DEBUG) console.log("seed", seed);
      const hdwallet = hdkey.fromMasterSeed(seed);
      const wallet_hdpath = "m/44'/60'/0'/0/";
      const account_index = 0;
      const fullPath = wallet_hdpath + account_index;
      if (DEBUG) console.log("fullPath", fullPath);
      const wallet = hdwallet.derivePath(fullPath).getWallet();
      const privateKey = "0x" + wallet._privKey.toString("hex");
      if (DEBUG) console.log("privateKey", privateKey);

      const EthUtil = require("ethereumjs-util");
      address =
        "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");

      const rlp = require("rlp");
      const keccak = require("keccak");

      const nonce = 0x00; // The nonce must be a hex literal!
      const sender = address;

      const input_arr = [sender, nonce];
      const rlp_encoded = rlp.encode(input_arr);

      const contract_address_long = keccak("keccak256")
        .update(rlp_encoded)
        .digest("hex");

      contract_address = contract_address_long.substring(24); // Trim the first 24 characters.
    }

    console.log(
      "⛏  Account Mined as " +
        address +
        " and set as mnemonic in packages/hardhat"
    );
    console.log(
      "📜 This will create the first contract: " +
        chalk.magenta("0x" + contract_address)
    );
    console.log(
      "💬 Use 'yarn run account' to get more information about the deployment account."
    );

    fs.writeFileSync(
      "./" + address + "_produces" + contract_address + ".txt",
      mnemonic.toString()
    );
    fs.writeFileSync("./mnemonic.txt", mnemonic.toString());
  });

task(
  "account",
  "Get balance informations for the deployment account.",
  async (_, { ethers }) => {
    const hdkey = require("ethereumjs-wallet/hdkey");

    const bip39 = require("bip39");
    const mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim();
    if (DEBUG) console.log("mnemonic", mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    const fullPath = wallet_hdpath + account_index;
    if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet._privKey.toString("hex");
    if (DEBUG) console.log("privateKey", privateKey);

    const EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");

    const qrcode = require("qrcode-terminal");
    qrcode.generate(address);
    console.log("‍📬 Deployer Account is " + address);

    for (const n in hardhatConfig.networks) {
      // console.log(networks[n],n)
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          (hardhatConfig.networks[n] as HttpNetworkUserConfig).url
        );
        const balance = await provider.getBalance(address);
        console.log(" -- " + n + " --  -- -- 📡 ");
        console.log("   balance: " + ethers.utils.formatEther(balance));
        console.log(
          "   nonce: " + (await provider.getTransactionCount(address))
        );
      } catch (e) {
        if (DEBUG) {
          console.log(e);
        }
      }
    }
  }
);

async function addr(ethers, addr) {
  if (ethers.isAddress(addr)) {
    return ethers.getAddress(addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts[addr] !== undefined) {
    return accounts[addr];
  }
  throw `Could not normalize address: ${addr}`;
}

task("accounts", "Prints the list of accounts", async (_, { ethers }) => {
  const accounts = await ethers.getSigners();
  accounts.forEach((account) => console.log(account));
});

task("blockNumber", "Prints the block number", async (_, { ethers }) => {
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(blockNumber);
});

task("balance", "Prints an account's balance")
  .addPositionalParam("account", "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(
      await addr(ethers, taskArgs.account)
    );
    console.log(ethers.utils.formatUnits(balance, "ether"), "ETH");
  });

function send(signer, txparams) {
  return signer.sendTransaction(txparams, (error, transactionHash) => {
    if (error) {
      debug(`Error: ${error}`);
    }
    debug(`transactionHash: ${transactionHash}`);
    // checkForReceipt(2, params, transactionHash, resolve)
  });
}

task("send", "Send ETH")
  .addParam("from", "From address or account index")
  .addOptionalParam("to", "To address or account index")
  .addOptionalParam("amount", "Amount to send in ether")
  .addOptionalParam("data", "Data included in transaction")
  .addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
  .addOptionalParam("gasLimit", "Limit of how much gas to spend")

  .setAction(async (taskArgs, { network, ethers }) => {
    const from = await addr(ethers, taskArgs.from);
    debug(`Normalized from address: ${from}`);
    const fromSigner = await ethers.provider.getSigner(from);

    let to;
    if (taskArgs.to) {
      to = await addr(ethers, taskArgs.to);
      debug(`Normalized to address: ${to}`);
    }
    var signerAddress = await fromSigner.getAddress();
    const txRequest = {
      from: signerAddress,
      to,
      value: ethers.utils.parseUnits(
        taskArgs.amount ? taskArgs.amount : "0",
        "ether"
      ),
      nonce: await ethers.provider.getTransactionCount(signerAddress),
      gasPrice: ethers.utils.parseUnits(
        taskArgs.gasPrice ? taskArgs.gasPrice : "1.001",
        "gwei"
      ),
      gasLimit: taskArgs.gasLimit ? taskArgs.gasLimit : 24000,
      chainId: network.config.chainId,
      data: undefined,
    };

    if (taskArgs.data !== undefined) {
      txRequest.data = taskArgs.data;
      debug(`Adding data to payload: ${txRequest.data}`);
    }

    debug(
      ethers.BigNumber.from(txRequest.gasPrice).div(1000000000).toHexString() +
        " gwei"
    );
    debug(JSON.stringify(txRequest, null, 2));

    return send(fromSigner, txRequest);
  });

task("generateGovernQueueConfig:gnosis")
  .setDescription("Generate GovernQueue config tupple")
  .addOptionalParam(
    "executionDelay",
    "Execution delay for claims in seconds (default is 7 days)",
    defaultConfig.ClaimDelay.xdai,
    types.int
  )
  .addOptionalParam(
    "scheduleDepositToken",
    "Address of the schedule deposit token (default is HNY)",
    defaultConfig.ScheduleDeposit.xdai.token
  )
  .addOptionalParam(
    "scheduleDepositAmount",
    "Amount of the schedule deposit token",
    defaultConfig.ScheduleDeposit.xdai.amount,
    types.float
  )
  .addOptionalParam(
    "challengeDepositToken",
    "Address of the challenge deposit token (default is HNY)",
    defaultConfig.ChallengeDeposit.xdai.token
  )
  .addOptionalParam(
    "challengeDepositAmount",
    "Amount of the challenge deposit token",
    defaultConfig.ChallengeDeposit.xdai.amount,
    types.float
  )
  .addOptionalParam(
    "resolver",
    "Address of Celeste(IArbitrator)",
    defaultConfig.CelesteResolver.xdai
  )
  .addOptionalParam(
    "rules",
    "Rules of how DAO should be managed",
    "0x0000000000000000000000000000000000000000"
  )
  .addOptionalParam(
    "maxCalldataSize",
    "Max calldatasize for the schedule",
    100000,
    types.int
  )
  .setAction(async (taskArgs) => {
    const config = generateQueueConfig(taskArgs);
    const tupple = [
      config.executionDelay,
      [config.scheduleDeposit.token, config.scheduleDeposit.amount],
      [config.challengeDeposit.token, config.challengeDeposit.amount],
      config.resolver,
      config.rules,
      config.maxCalldataSize,
    ];
    console.log("Config tupple : ", JSON.stringify(tupple));
  });

task("generateGovernQueueConfig:goerli")
  .setDescription("Generate GovernQueue config tupple")
  .addOptionalParam(
    "executionDelay",
    "Execution delay for claims in seconds (default is 7 days)",
    defaultConfig.ClaimDelay.goerli,
    types.int
  )
  .addOptionalParam(
    "scheduleDepositToken",
    "Address of the schedule deposit token (default is HNY)",
    defaultConfig.ScheduleDeposit.goerli.token
  )
  .addOptionalParam(
    "scheduleDepositAmount",
    "Amount of the schedule deposit token",
    defaultConfig.ScheduleDeposit.goerli.amount,
    types.float
  )
  .addOptionalParam(
    "challengeDepositToken",
    "Address of the challenge deposit token (default is HNY)",
    defaultConfig.ChallengeDeposit.goerli.token
  )
  .addOptionalParam(
    "challengeDepositAmount",
    "Amount of the challenge deposit token",
    defaultConfig.ChallengeDeposit.goerli.amount,
    types.float
  )
  .addOptionalParam(
    "resolver",
    "Address of Celeste(IArbitrator)",
    defaultConfig.CelesteResolver.goerli
  )
  .addOptionalParam(
    "rules",
    "Rules of how DAO should be managed",
    "0x0000000000000000000000000000000000000000"
  )
  .addOptionalParam(
    "maxCalldataSize",
    "Max calldatasize for the schedule",
    100000,
    types.int
  )
  .setAction(async (taskArgs) => {
    const config = generateQueueConfig(taskArgs);
    const tupple = [
      config.executionDelay,
      [config.scheduleDeposit.token, config.scheduleDeposit.amount],
      [config.challengeDeposit.token, config.challengeDeposit.amount],
      config.resolver,
      config.rules,
      config.maxCalldataSize,
    ];
    console.log("Config tupple : ", JSON.stringify(tupple));
  });

task("newGovernQueue:gnosis")
  .setDescription("Deploy a new GovernQueue and export it to front end")
  .addParam("aclRoot", "Address that will be granted Root ACL role")
  .addOptionalParam(
    "governQueueFactoryAddress",
    "Address of the govern queue factory",
    defaultConfig.GovernQueueFactory.xdai
  )
  .addOptionalParam(
    "resolver",
    "Address of Celeste(IArbitrator)",
    defaultConfig.CelesteResolver.xdai
  )
  .addOptionalParam(
    "executionDelay",
    "Execution delay for claims in seconds (default is 7 days)",
    defaultConfig.ClaimDelay.xdai,
    types.int
  )
  .addOptionalParam(
    "scheduleDepositToken",
    "Address of the schedule deposit token (default is HNY)",
    defaultConfig.ScheduleDeposit.xdai.token
  )
  .addOptionalParam(
    "scheduleDepositAmount",
    "Amount of the schedule deposit token",
    defaultConfig.ScheduleDeposit.xdai.amount,
    types.float
  )
  .addOptionalParam(
    "challengeDepositToken",
    "Address of the challenge deposit token (default is HNY)",
    defaultConfig.ChallengeDeposit.xdai.token
  )
  .addOptionalParam(
    "challengeDepositAmount",
    "Amount of the challenge deposit token",
    defaultConfig.ChallengeDeposit.xdai.amount,
    types.float
  )
  .setAction(deployGovernQueue);

task("newGovernQueue:goerli")
  .setDescription("Deploy a new GovernQueue and export it to front end")
  .addParam(
    "aclRoot",
    "Address that will be granted Root ACL role",
    defaultConfig.RootOwner.goerli
  )
  .addOptionalParam(
    "governQueueFactoryAddress",
    "Address of the govern queue factory",
    defaultConfig.GovernQueueFactory.goerli
  )
  .addOptionalParam(
    "resolver",
    "Address of Celeste(IArbitrator)",
    defaultConfig.CelesteResolver.goerli
  )
  .addOptionalParam(
    "executionDelay",
    "Execution delay for claims in seconds (default is 5 min)",
    defaultConfig.ClaimDelay.goerli,
    types.int
  )
  .addOptionalParam(
    "scheduleDepositToken",
    "Address of the schedule deposit token (default is HNYT)",
    defaultConfig.ScheduleDeposit.goerli.token
  )
  .addOptionalParam(
    "scheduleDepositAmount",
    "Amount of the schedule deposit token",
    defaultConfig.ScheduleDeposit.goerli.amount,
    types.float
  )
  .addOptionalParam(
    "challengeDepositToken",
    "Address of the challenge deposit token (default is HNYT)",
    defaultConfig.ChallengeDeposit.goerli.token
  )
  .addOptionalParam(
    "challengeDepositAmount",
    "Amount of the challenge deposit token",
    defaultConfig.ChallengeDeposit.goerli.amount,
    types.float
  )
  .setAction(deployGovernQueue);

task("newGovern:gnosis")
  .setDescription("Deploy a new Govern and export it to front end")
  .addParam(
    "initialExecutorAddress",
    "Address of the initial executor (should usually be the GovernQueue)"
  )
  .addOptionalParam(
    "governFactoryAddress",
    "Address of the govern factory",
    defaultConfig.GovernFactory.xdai
  )
  .setAction(deployGovern);

task("newGovern:goerli")
  .setDescription("Deploy a new Govern and export it to front end")
  .addParam(
    "initialExecutorAddress",
    "Address of the initial executor (should usually be the GovernQueue)"
  )
  .addOptionalParam(
    "governFactoryAddress",
    "Address of the govern factory",
    defaultConfig.GovernFactory.goerli
  )
  .setAction(deployGovern);

task("newQuestFactory:gnosis")
  .setDescription("Deploy a new QuestFactory and export it to front end")
  .addOptionalParam(
    "governAddress",
    "Address of the govern",
    governGnosis.address
  )
  .setAction(async (args, hre) => {
    console.log("Starting by deploying the Quest template...");
    await hre.run("newQuest");

    console.log("Deploying proxy upgrade for QuestFactory...");
    const address = await upgradeQuestFactory(hre, args);

    console.log(
      "Deployed proxy upgrade for QuestFactory (" + hre.network.name + "):",
      address
    );
  });

task("newQuestFactory:goerli")
  .setDescription("Deploy a new QuestFactory and export it to front end")
  .addOptionalParam(
    "governAddress",
    "Address of the govern",
    "0xe43217F71e496475660a3391FFbD1367e354e002"
  )
  .setAction(async (args, hre) => {
    console.log("Starting by deploying the Quest template...");
    await hre.run("newQuest", hre);

    console.log("Deploying proxy upgrade for QuestFactory...");
    const address = await upgradeQuestFactory(hre, args);

    console.log(
      "Deployed proxy upgrade for QuestFactory (" + hre.network.name + "):",
      address
    );
  });

task("newQuest")
  .setDescription("Deploy a new Quest and export it to front end")
  .setAction(async (hre) => {
    const deployResult = await deployQuest(hre);
    console.log(
      "Deployed quest template (" + hre.network.name + "):",
      deployResult.address
    );
  });

async function deployAll(
  args: {
    ownerAddress: string;
    governQueueFactoryAddress: string;
    governFactoryAddress: string;
    resolver: string;
    executionDelay: number;
    scheduleDepositToken: string;
    scheduleDepositAmount: number;
    challengeDepositToken: string;
    challengeDepositAmount: number;
    createDepositToken: string;
    createDepositAmount: number;
  },
  { run, network }: any
) {
  let networkId = network.name.toLowerCase();
  if (networkId === "xdai") {
    networkId = "gnosis";
  }
  const governQueueAddress = await run(`newGovernQueue:${networkId}`, {
    aclRoot: args.ownerAddress,
    governQueueFactoryAddress: args.governQueueFactoryAddress,
    resolver: args.resolver,
    executionDelay: args.executionDelay,
    scheduleDepositToken: args.scheduleDepositToken,
    scheduleDepositAmount: args.scheduleDepositAmount,
    challengeDepositToken: args.challengeDepositToken,
    challengeDepositAmount: args.challengeDepositAmount,
  });
  const governAddress = await run(`newGovern:${networkId}`, {
    initialExecutorAddress: governQueueAddress,
    governFactoryAddress: args.governFactoryAddress,
  });
  await run(`newQuestFactory:${networkId}`, {
    governAddress,
    initialOwner: args.ownerAddress,
    createDepositToken: args.createDepositToken,
    createDepositAmount: args.createDepositAmount,
  });

  // Will deploy a dummy quest just for bytecode matching when contract verification
  await run(`newQuest`);
}

task("deployAll:gnosis")
  .setDescription(
    "Deploy all the needed Govern and Quest contracts and export them to frontend"
  )
  .addOptionalParam(
    "ownerAddress",
    "Address that will be granted Root ACL role and owner for QuestFactory",
    defaultConfig.RootOwner.xdai
  )
  .addOptionalParam(
    "governQueueFactoryAddress",
    "Address of the govern queue factory",
    defaultConfig.GovernQueueFactory.xdai
  )
  .addOptionalParam(
    "governFactoryAddress",
    "Address of the govern factory",
    defaultConfig.GovernFactory.xdai
  )
  .addOptionalParam(
    "resolver",
    "Address of Celeste(IArbitrator)",
    defaultConfig.CelesteResolver.xdai
  )
  .addOptionalParam(
    "executionDelay",
    "Execution delay for claims in seconds (default is 5 min)",
    defaultConfig.ClaimDelay.xdai,
    types.int
  )
  .addOptionalParam(
    "scheduleDepositToken",
    "Address of the schedule deposit token",
    defaultConfig.ScheduleDeposit.xdai.token
  )
  .addOptionalParam(
    "scheduleDepositAmount",
    "Amount of the schedule deposit token",
    defaultConfig.ScheduleDeposit.xdai.amount,
    types.float
  )
  .addOptionalParam(
    "challengeDepositToken",
    "Address of the challenge deposit token",
    defaultConfig.ChallengeDeposit.xdai.token
  )
  .addOptionalParam(
    "challengeDepositAmount",
    "Amount of the challenge deposit token",
    defaultConfig.ChallengeDeposit.xdai.amount,
    types.float
  )
  .addOptionalParam(
    "createQuestDepositToken",
    "Address of the create quest deposit token",
    defaultConfig.CreateQuestDeposit.xdai.token
  )
  .addOptionalParam(
    "createQuestDepositAmount",
    "Amount of the create quest deposit token",
    defaultConfig.CreateQuestDeposit.xdai.amount,
    types.float
  )
  .setAction(deployAll);

task("deployAll:goerli")
  .setDescription(
    "Deploy all the needed Govern and Quest contracts and export them to frontend"
  )
  .addOptionalParam(
    "ownerAddress",
    "Address that will be granted Root ACL role and owner for QuestFactory",
    defaultConfig.RootOwner.goerli
  )
  .addOptionalParam(
    "governQueueFactoryAddress",
    "Address of the govern queue factory",
    defaultConfig.GovernQueueFactory.goerli
  )
  .addOptionalParam(
    "governFactoryAddress",
    "Address of the govern factory",
    defaultConfig.GovernFactory.goerli
  )
  .addOptionalParam(
    "resolver",
    "Address of Celeste(IArbitrator)",
    CelesteMockGoerli.address
  )
  .addOptionalParam(
    "executionDelay",
    "Execution delay for claims in seconds (default is 5 min)",
    defaultConfig.ClaimDelay.goerli,
    types.int
  )
  .addOptionalParam(
    "scheduleDepositToken",
    "Address of the schedule deposit token",
    defaultConfig.ScheduleDeposit.goerli.token
  )
  .addOptionalParam(
    "scheduleDepositAmount",
    "Amount of the schedule deposit token",
    defaultConfig.ScheduleDeposit.goerli.amount,
    types.float
  )
  .addOptionalParam(
    "challengeDepositToken",
    "Address of the challenge deposit token",
    defaultConfig.ChallengeDeposit.goerli.token
  )
  .addOptionalParam(
    "challengeDepositAmount",
    "Amount of the challenge deposit token",
    defaultConfig.ChallengeDeposit.goerli.amount,
    types.float
  )
  .addOptionalParam(
    "createQuestDepositToken",
    "Address of the create quest deposit token",
    defaultConfig.CreateQuestDeposit.goerli.token
  )
  .addOptionalParam(
    "createQuestDepositAmount",
    "Amount of the create quest deposit token",
    defaultConfig.CreateQuestDeposit.goerli.amount,
    types.float
  )
  .setAction(deployAll);

task("grantGovernQueue").setAction(
  async (_args, { ethers, getNamedAccounts }) => {
    const { owner } = await getNamedAccounts();
    const publicQueueFonctions = [
      "schedule",
      "resolve",
      "challenge",
      "execute",
    ];
    const ownerOnlyQueueFonctions = ["veto", "configure"];
    const queueFonctions = publicQueueFonctions.concat(ownerOnlyQueueFonctions);
    const aclGovernFunctions = [
      "withdraw",
      "exec",
      "registerStandardAndCallback",
      "setSignatureValidator",
    ];
    console.log("GovernQueue roles:");
    const publicGrant = "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF";
    let roles = [];
    var governQueueAbiInterface = new ethers.utils.Interface(GovernQueueAbi);
    for (const obj of GovernQueueAbi) {
      if (obj.type !== "function" || !queueFonctions.includes(obj.name)) {
        continue;
      }
      let signature = governQueueAbiInterface.getSighash(obj.name);
      roles.push({
        signature,
        address: ownerOnlyQueueFonctions.includes(obj.name)
          ? owner
          : publicGrant,
      });
      console.log(`${obj.name}:`, signature);
    }
    console.log("Bulk grant:");
    console.log(
      `[${roles.map((x) => `[0,"${x.signature}","${x.address}"]`).join(",")}]`
    );
    console.log("Govern roles:");
    var governAbiInterface = new ethers.utils.Interface(GovernAbi);
    for (const obj of GovernAbi) {
      if (obj.type !== "function" || !aclGovernFunctions.includes(obj.name)) {
        continue;
      }
      let signature = governAbiInterface.getSighash(obj.name);
      roles.push({
        signature,
        address: owner,
      });
      console.log(`${obj.name}:`, signature);
    }
  }
);

task("deployCeleste:goerli")
  .setDescription("Deploy a mock version of Celeste on goerli")
  .addOptionalParam(
    "feeToken",
    "Address of the challenge fee token",
    defaultConfig.ChallengeFee.goerli.token
  )
  .addOptionalParam(
    "feeAmount",
    "Amount of the challenge fee",
    defaultConfig.ChallengeFee.goerli.amount,
    types.float
  )
  .setAction(
    async (args, { deployments, ethers, getNamedAccounts, network, run }) => {
      const { deployer, owner } = await getNamedAccounts();
      const constructorArguments = [
        args.feeToken,
        ethers.utils.parseEther(args.feeAmount.toString()),
      ];
      const result = await deployments.deploy("OwnableCeleste", {
        from: deployer,
        args: constructorArguments,
        gasLimit: 10000000,
      });
      console.log("Deployed Celeste (" + network.name + "):", result.address);
      const contract = await ethers.getContractAt(result.abi, result.address);
      await contract.setOwner(owner, { from: deployer, gasLimit: 500000 });
      const [disputeManager] = await contract.getDisputeManager();
      console.log("Ownership transfered to: ", owner);
      exportContractResult(network, "Celeste", result);

      try {
        console.log("Verifying OwnableCeleste...");
        await new Promise((res, rej) => {
          setTimeout(async () => {
            Promise.all([
              run("verify:verify", {
                address: disputeManager,
                constructorArguments: [result.address],
              }),
            ])
              .then(res)
              .catch(rej);
          }, 2000); // Wait for contract to be deployed
        });
      } catch (error) {
        console.error("Failed when verifying OwnableCeleste contract", error);
      }

      exportContractResult(network, "Celeste", result);
    }
  );

task(
  "verify-quests-contracts",
  "Verify contracts with etherscan api"
).setAction(async (_args, { run, network }) => {
  const questFactoryDeploy = require(`./deployments/${network.name.toLowerCase()}/QuestFactory.json`);
  const questDeploy = require(`./deployments/${network.name.toLowerCase()}/Quest.json`);
  console.log("Quest", {
    address: questDeploy.address,
    constructorArguments: questDeploy.args,
  });
  try {
    await run("verify:verify", {
      address: questFactoryDeploy.address,
      constructorArguments: questFactoryDeploy.args,
    });
  } catch (error) {
    console.error("Failed when verifying QuestFactory contract", error);
  }
  try {
    await run("verify:verify", {
      address: questDeploy.address,
      constructorArguments: questDeploy.args,
    });
  } catch (error) {
    console.error("Failed when verifying Quest contract", error);
  }
});

module.exports = hardhatConfig;
