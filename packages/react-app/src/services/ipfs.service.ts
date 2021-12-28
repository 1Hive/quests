import ipfsAPI, { Options } from 'ipfs-http-client';
import { Logger } from 'src/utils/logger';
import { toAscii, toHex } from 'web3-utils';

const configInfura = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
} as Options;

const configTheGraph = {
  url: 'http://api.thegraph.com/ipfs/api/v0',
};

const ipfsInfura = ipfsAPI.create(configInfura);
const ipfsTheGraph = ipfsAPI.create(configTheGraph);

export const getIpfsBaseUri = () => `${configTheGraph.url}/cat?arg=`;

export const pushObjectToIpfs = async (obj: Object): Promise<string> => {
  const response = await ipfsTheGraph.add(obj.toString());
  const cid = response.cid.toString();
  Logger.debug('New IPFS at address', cid);
  return toHex(cid);
};

export const getObjectFromIpfs = async (objHasHex: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of ipfsInfura.get(toAscii(objHasHex))) {
    const decodedSplit = new TextDecoder('utf-8')
      .decode(value)
      .trim()
      .split('\x00')
      .filter((x) => !!x); // Only one result

    return decodedSplit[decodedSplit.length - 1];
  }
  return undefined; // No result
};
