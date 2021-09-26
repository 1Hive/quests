import {
  ipfs,
  nodeMayAllowPublish,
  publishHashToIPNS,
  pushDirectoryToIPFS,
} from '../src/services/IpfsService';

const { clearLine } = require('readline');
const chalk = require('chalk');

const ipfsGateway = 'https://ipfs.io/ipfs/';
const ipnsGateway = 'https://ipfs.io/ipns/';

const deployWebApp = async () => {
  console.log('🛰  Sending to IPFS...');
  const { cid } = await pushDirectoryToIPFS('./build');
  if (!cid) {
    console.log(`📡 App deployment failed`);
    return false;
  }
  console.log(`📡 App deployed to IPFS with hash: ${chalk.cyan(cid.toString())}`);

  console.log();

  let ipnsName = '';
  if (nodeMayAllowPublish(ipfs)) {
    console.log(`✍️  Publishing /ipfs/${cid.toString()} to IPNS...`);
    process.stdout.write('   Publishing to IPNS can take up to roughly two minutes.\r');
    ipnsName = (await publishHashToIPNS(cid.toString())).name;
    clearLine(process.stdout, 0);
    if (!ipnsName) {
      console.log('   Publishing IPNS name on node failed.');
    }
    console.log(`🔖 App published to IPNS with name: ${chalk.cyan(ipnsName)}`);
    console.log();
  }

  console.log('🚀 Deployment to IPFS complete!');
  console.log();

  console.log(`Use the link${ipnsName && 's'} below to access your app:`);
  console.log(`   IPFS: ${chalk.cyan(`${ipfsGateway}${cid.toString()}`)}`);
  if (ipnsName) {
    console.log(`   IPNS: ${chalk.cyan(`${ipnsGateway}${ipnsName}`)}`);
    console.log();
    console.log(
      'Each new deployment will have a unique IPFS hash while the IPNS name will always point at the most recent deployment.',
    );
    console.log(
      'It is recommended that you share the IPNS link so that people always see the newest version of your app.',
    );
  }
  console.log();
  return true;
};

deployWebApp();
