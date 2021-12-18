import ipfsAPI from 'ipfs-http-client';

const config = {
  url: 'http://api.thegraph.com/ipfs/api/v0',
};

const ipfs = ipfsAPI.create(config);

export const getIpfsBaseUri = () => `${config.url}/cat?arg=`;

export const pushObjectToIpfs = async (obj: Object): Promise<string> => {
  const response = await ipfs.add(obj.toString());
  return response.cid.toString();
};

export const getObjectFromIpfs = async (objHash: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of ipfs.get(objHash)) {
    const decoded = new TextDecoder('utf-8').decode(value); // Only one result
    return decoded.substring(decoded.indexOf('{'), decoded.lastIndexOf('}') + 1).trim();
  }
  return undefined; // No result
};
