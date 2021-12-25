import ipfsAPI, { Options } from 'ipfs-http-client';
import { Logger } from 'src/utils/logger';
import { toAscii, toHex } from 'web3-utils';

const config = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
} as Options;

const ipfs = ipfsAPI.create(config);

export const getIpfsBaseUri = () => `${config.url}/cat?arg=`;

export const pushObjectToIpfs = async (obj: Object): Promise<string> => {
  const response = await ipfs.add(obj.toString());
  const cid = response.cid.toString();
  Logger.debug('New IPFS at address', cid);
  return toHex(cid);
};

export const getObjectFromIpfs = async (objHasHex: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of ipfs.get(toAscii(objHasHex))) {
    const decodedSplit = new TextDecoder('utf-8')
      .decode(value)
      .trim()
      .split('\x00')
      .filter((x) => !!x); // Only one result

    return decodedSplit[decodedSplit.length - 1];
  }
  return undefined; // No result
};
