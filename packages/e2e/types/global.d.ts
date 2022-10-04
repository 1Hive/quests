import * as dappeteer from '@chainsafe/dappeteer';

declare global {
  var metamask: dappeteer.Dappeteer;
}

export {};
