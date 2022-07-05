import ipfsAPI, { IPFSHTTPClient, Options } from 'ipfs-http-client';
import { Logger } from 'src/utils/logger';
import { hexToAscii, toAscii, toHex } from 'web3-utils';

const configInfura = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
} as Options;

const configTheGraph = {
  url: 'https://api.thegraph.com/ipfs/api/v0',
};

export const ipfsInfura = ipfsAPI.create(configInfura);
export const ipfsTheGraph = ipfsAPI.create(configTheGraph);

export const getIpfsBaseUri = () => `${configTheGraph.url}/cat?arg=`;

export const formatIpfsMarkdownLink = (ipfsHash: string, label: string) => {
  if (ipfsHash.startsWith('0x')) {
    ipfsHash = hexToAscii(ipfsHash);
  }
  return `[${label}](${getIpfsBaseUri()}${ipfsHash})`;
};

export const pushObjectToIpfs = async (obj: Object | string): Promise<string> => {
  let json;
  if (!(typeof obj === 'string')) {
    json = JSON.stringify(obj);
  } else {
    json = obj;
  }
  const response = await ipfsTheGraph.add(json);
  const cid = response.cid.toString();
  Logger.debug('New IPFS at address', cid);
  return toHex(cid);
};

(window as any).pushObjectToIpfs = pushObjectToIpfs;

export async function getObjectFromIpfs<TResult = string>(
  objHasHex: string,
  configOverride?: IPFSHTTPClient,
) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of (configOverride ?? ipfsInfura).cat(toAscii(objHasHex))) {
    const decodedSplit = new TextDecoder('utf-8')
      .decode(value)
      .trim()
      .split('\x00')
      .filter((x) => !!x); // Only one result

    const ipfsResult = decodedSplit[decodedSplit.length - 1];
    try {
      const parsed = JSON.parse(ipfsResult) as TResult;
      if (typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // eslint-disable-next-line no-empty
    }
    return ipfsResult; // Return the raw string
  }
  return undefined; // No result
}

/**
 * This method will go through all IPFS configs until it finds one that works.
 * If no one, will result in a markdown link to the IPFS object.
 */
export const getObjectFromIpfsSafe = async (evidenceIpfsHash: string) => {
  let ipfsObject: string | Object | undefined;
  try {
    ipfsObject = await getObjectFromIpfs(evidenceIpfsHash);
  } catch (error: any) {
    Logger.warn(error, 'Failed to get IPFS object when fetching claims');
    ipfsObject = await getObjectFromIpfs(evidenceIpfsHash, ipfsTheGraph);
  }
  // If failed to fetch ipfs evidence
  if (!ipfsObject) ipfsObject = formatIpfsMarkdownLink(evidenceIpfsHash, 'See evidence');
  return ipfsObject;
};
