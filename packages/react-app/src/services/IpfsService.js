const ipfsAPI = require('ipfs-http-client');

const { globSource } = ipfsAPI;

const infura = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
};
// run your own ipfs daemon: https://docs.ipfs.io/how-to/command-line-quick-start/#install-ipfs
// const localhost = { host: "localhost", port: "5001", protocol: "http" };

export const ipfs = ipfsAPI.create(infura);

const addOptions = {
  pin: true,
};

export const pushDirectoryToIPFS = async (path) => {
  try {
    // @ts-ignore
    const response = await ipfs.add(globSource(path, { recursive: true }), addOptions);
    return response;
  } catch (e) {
    return {};
  }
};

export const publishHashToIPNS = async (ipfsHash) => {
  try {
    const response = await ipfs.name.publish(`/ipfs/${ipfsHash}`);
    return response;
  } catch (e) {
    return {};
  }
};

export const nodeMayAllowPublish = (ipfsClient) => {
  // You must have your own IPFS node in order to publish an IPNS name
  // This contains a blacklist of known nodes which do not allow users to publish IPNS names.
  const nonPublishingNodes = ['ipfs.infura.io'];
  const { host } = ipfsClient.getEndpointConfig();
  return !nonPublishingNodes.some((nodeUrl) => host.includes(nodeUrl));
};

export const pushObjectToIpfs = async (obj) => {
  const response = await ipfs.add(JSON.stringify(obj));
  return response.cid;
};

export const getObjectFromIpfs = async (objHash) => {
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of ipfs.get(objHash)) {
    const decoded = new TextDecoder('utf-8').decode(value); // Only one result
    return decoded.substring(decoded.indexOf('{'), decoded.lastIndexOf('}') + 1).trim();
  }
  return null; // No result
};
