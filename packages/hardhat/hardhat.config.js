/* eslint-disable */
const fs = require("fs");
const chalk = require("chalk");
require("hardhat-deploy");
// @ts-ignore
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
const { utils } = require("ethers");
const { task } = require("hardhat/config");

const { isAddress, getAddress, formatUnits, parseUnits } = utils;

/*
      📡 This is where you configure your deploy configuration for 🏗 scaffold-eth

      check out `packages/scripts/deploy.js` to customize your deployment

      out of the box it will auto deploy anything in the `contracts` folder and named *.sol
      plus it will use *.args for constructor args
*/

//
// Select the network you want to deploy to here:
//
const defaultNetwork = "localhost";
const mainnetGwei = 21;

function mnemonic() {
  try {
    if (!process.env.MNEMONIC) throw new Error("No mnemonic detected");
    return process.env.MNEMONIC;
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log(
        "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
      );
    }
  }
  return "";
}
module.exports = {
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
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_ID, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    kovan: {
      url: "https://kovan.infura.io/v3/" + process.env.INFURA_ID, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + process.env.INFURA_ID, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        gasPrice: mainnetGwei * 1000000000,
        mnemonic: mnemonic(),
      },
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/" + process.env.INFURA_ID, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    goerli: {
      url: "https://goerli.infura.io/v3/" + process.env.INFURA_ID, // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    xdai: {
      url: "https://rpc.xdaichain.com/",
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com/",
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    rinkebyArbitrum: {
      url: "https://rinkeby.arbitrum.io/rpc",
      gasPrice: 0,
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l1: "rinkeby",
      },
    },
    localArbitrum: {
      url: "http://localhost:8547",
      gasPrice: 0,
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l1: "localArbitrumL1",
      },
    },
    localArbitrumL1: {
      url: "http://localhost:7545",
      gasPrice: 0,
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l2: "localArbitrum",
      },
    },
    kovanOptimism: {
      url: "https://kovan.optimism.io",
      gasPrice: 0,
      accounts: {
        mnemonic: mnemonic(),
      },
      ovm: true,
      companionNetworks: {
        l1: "kovan",
      },
    },
    localOptimism: {
      url: "http://localhost:8545",
      gasPrice: 0,
      accounts: {
        mnemonic: mnemonic(),
      },
      ovm: true,
      companionNetworks: {
        l1: "localOptimismL1",
      },
    },
    localOptimismL1: {
      url: "http://localhost:9545",
      gasPrice: 0,
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l2: "localOptimism",
      },
    },
    localAvalanche: {
      url: "http://localhost:9650/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43112,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    fujiAvalanche: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mainnetAvalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetHarmony: {
      url: "https://api.s0.b.hmny.io",
      gasPrice: 1000000000,
      chainId: 1666700000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mainnetHarmony: {
      url: "https://api.harmony.one",
      gasPrice: 1000000000,
      chainId: 1666600000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  ovm: {
    solcVersion: "0.7.6",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      100: 0,
      rinkeby: "0x84b9514E013710b9dD0811c9Fe46b837a4A0d8E0", // Static address for test purposes
    },
    govern: {
      default: 1,
      100: "TODO : Add XDai Govern Address",
      rinkeby: "0xc03710063b0e4435f997A0B1bbdf2680A2f07E13", // Governn address on rinkeby
      xdai: "", // TODO : Add address when Govern will be deployed on xDai chain
    },
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
  // @ts-ignore
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
      // @ts-ignore
      let deployerWallet = new ethers.Wallet.fromMnemonic(
        // @ts-ignore
        localDeployerMnemonic
      );
      deployerWallet = deployerWallet.connect(ethers.provider);
      console.log(
        "💵 Sending " +
          amount +
          " ETH to " +
          randomWallet.address +
          " using deployer account"
      );
      // @ts-ignore
      const sendresult = await deployerWallet.sendTransaction(tx);
      console.log("\n" + url + "/pk#" + privateKey + "\n");
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
  // @ts-ignore
  async (_, { ethers }) => {
    // @ts-ignore
    const bip39 = require("bip39");
    // @ts-ignore
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
    // @ts-ignore
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
  // @ts-ignore
  .setAction(async (taskArgs, { network, ethers }) => {
    let contract_address = "";
    let address;

    // @ts-ignore
    const bip39 = require("bip39");
    // @ts-ignore
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
      // @ts-ignore
      const EthUtil = require("ethereumjs-util");
      address =
        "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");

      const rlp = require("rlp");
      const keccak = require("keccak");

      const nonce = 0x00; // The nonce must be a hex literal!
      const sender = address;

      const input_arr = [sender, nonce];
      const rlp_encoded = rlp.encode(input_arr);

      // @ts-ignore
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
    // @ts-ignore
    const hdkey = require("ethereumjs-wallet/hdkey");
    // @ts-ignore
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
    // @ts-ignore
    const EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");

    const qrcode = require("qrcode-terminal");
    qrcode.generate(address);
    console.log("‍📬 Deployer Account is " + address);
    // @ts-ignore
    for (const n in config.networks) {
      // console.log(config.networks[n],n)
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          // @ts-ignore
          config.networks[n].url
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
  if (isAddress(addr)) {
    return getAddress(addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts[addr] !== undefined) {
    return accounts[addr];
  }
  throw `Could not normalize address: ${addr}`;
}

task("accounts", "Prints the list of accounts", async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts();
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
    console.log(formatUnits(balance, "ether"), "ETH");
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

    const txRequest = {
      from: await fromSigner.getAddress(),
      to,
      value: parseUnits(
        taskArgs.amount ? taskArgs.amount : "0",
        "ether"
      ).toHexString(),
      nonce: await fromSigner.getTransactionCount(),
      gasPrice: parseUnits(
        taskArgs.gasPrice ? taskArgs.gasPrice : "1.001",
        "gwei"
      ).toHexString(),
      gasLimit: taskArgs.gasLimit ? taskArgs.gasLimit : 24000,
      chainId: network.config.chainId,
    };

    if (taskArgs.data !== undefined) {
      txRequest.data = taskArgs.data;
      debug(`Adding data to payload: ${txRequest.data}`);
    }
    // @ts-ignore
    debug(txRequest.gasPrice / 1000000000 + " gwei");
    debug(JSON.stringify(txRequest, null, 2));

    return send(fromSigner, txRequest);
  });
