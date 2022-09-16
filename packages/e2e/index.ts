import puppeteer from "puppeteer";
import fs from "fs";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { launch, getMetamask, setupMetamask } from "@sriharikapu/dappetter";

dotenvConfig({
  path: resolve(
    __dirname,
    fs
      .readdirSync("../../")
      .filter(
        (allFilesPaths: string) => allFilesPaths.match(/\.env$/) !== null
      )[0]
  ),
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function main() {
  const browser = await launch(puppeteer, {
    metamaskVersion: "v10.8.1",
    defaultViewport: null,
  });
  const metamask = await setupMetamask(browser, {
    seed: process.env.E2E_SECRET_WORDS,
  });
  await metamask.addNetwork({
    networkName: "Goerli",
    rpc: "https://goerli.infura.io/v3/",
    chainId: "5",
    symbol: "AVX",
  });

  await metamask.switchNetwork("Goerli");
  const page = await browser.newPage();
  await page.goto("https://quests-git-dev-1hive.vercel.app");
  await page.screenshot({ path: "./screenshots/example.png" });
}
main();
