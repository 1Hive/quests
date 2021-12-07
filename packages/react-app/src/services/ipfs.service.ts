const ipfsAPI = require('ipfs-http-client');

const projectId = '1ybJNw3SNodb56QTsPl6hKpzKdb';
const projectSecret = 'a0ec06faf24ca9368f87a1c4260d69d7';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

const infura = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
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
