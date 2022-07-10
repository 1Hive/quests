const child_process = require("child_process");
import fs from "fs";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({
  path: resolve(
    __dirname,
    fs
      .readdirSync("../../../../")
      .filter((allFilesPaths) => allFilesPaths.match(/\.env$/) !== null)[0]
  ),
});
// Arguments
const args = process.argv.slice(2);
const user = args[0];
const name = args[1];
const network = args[2];
// Deploy subgraph
let command = "";
if (network === "local" || network === "localhost")
  command = `graph deploy ${user}/${name} --ipfs http://localhost:5001 --node http://localhost:8020`;
else
  command = `graph deploy ${user}/${name} --ipfs https://api.thegraph.com/ipfs/ --node https://api.thegraph.com/deploy/ --access-token ${process.env.THE_GRAPH_ACCESS_TOKEN}`;

child_process.exec(command, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
