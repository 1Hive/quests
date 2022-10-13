import * as dappeteer from '@chainsafe/dappeteer';

declare global {
  let metamask: dappeteer.Dappeteer;
}

export {};
