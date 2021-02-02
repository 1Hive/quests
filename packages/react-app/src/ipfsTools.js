import { IpfsApi } from '../scripts/ipfsApi.js';

// Config
var ipfsHost    = 'localhost',
    ipfsAPIPort = '5001',
    ipfsWebPort = '8080';

window.ipfs = ipfs;
window.ipfsDataHost = "http://" + ipfsHost + ':' + ipfsWebPort + "/ipfs";

//CHECK/VERIFY if it works correctly
var ipfs = IpfsApi.IpfsAPI(ipfsHost, ipfsAPIPort);

ipfs.swarm.peers(function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log("IPFS - connected to " + response.Strings.length + " peers");
            console.log(response);
        }
    });

//WILL ONLY work once the contractInstance object is set
function getData() {
      if (!window.contractInstance) {
          console.error('Make sure you deploy your contract first');
          return;
      }

      window.contractInstance.get.call(function(err, result){
          if (err) {
              console.error('Error getting data: ', err);
          } else if (result) {
              if (window.currentIPFSHash == result) {
                  console.log("New data hasn't been mined yet. This is your current data: ", result);
                  return;
              }

              window.currentIPFSHash = result
              var imageURL = window.ipfsDataHost + "/" + result;
              console.log('File: ', result);
              console.log(imageURL);
          } else {
              console.error('No data. Transaction not mined yet?');
          }
      });
  }

function addToIPFS(url) {
  window.ipfs.add(url, function(err, result) {
      if (err) {
          console.error('Error sending file: ', err);
          return null;
      } else if (result && result[0] && result[0].Hash) {
          var imageURL = window.ipfsDataHost + "/" + result[0].Hash;
          console.log('File: ', result[0].Hash);
          console.log(imageURL);
      } else {
          console.error('No file for you...');
          return null;
      }
  });
}