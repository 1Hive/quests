const ipfsAPI = require('ipfs-http-client');

const infura = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
};

const ipfs = ipfsAPI.create(infura);

export const pushObjectToIpfs = async (obj: Object) => {
  const response = await ipfs.add(JSON.stringify(obj));
  return response.cid;
};

export const getObjectFromIpfs = async (objHash: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of ipfs.get(objHash)) {
    const decoded = new TextDecoder('utf-8').decode(value); // Only one result
    return decoded.substring(decoded.indexOf('{'), decoded.lastIndexOf('}') + 1).trim();
  }
  return null; // No result
};
