import ipfsAPI, { Options } from 'ipfs-http-client';
import { Logger } from 'src/utils/logger';

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
  return cid;
};

export const getObjectFromIpfs = async (objHash: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of ipfs.get(objHash)) {
    const decodedSplit = new TextDecoder('utf-8')
      .decode(value)
      .trim()
      .split('\x00')
      .filter((x) => !!x); // Only one result

    return decodedSplit[decodedSplit.length - 1];
  }
  return undefined; // No result
};
