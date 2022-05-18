import cipher from './icons/Cipher.png';
import fortmatic from './icons/Fortmatic.svg';
import frame from './icons/Frame.png';
import metamask from './icons/Metamask.png';
import status from './icons/Status.png';
import walletConnect from './icons/WalletConnect.png';

// See the corresponding prop type, EthereumProviderType, in prop-types.js.
const PROVIDERS = new Map(
  [
    {
      id: 'frame',
      name: 'Frame',
      type: 'Desktop',
      image: frame,
      strings: {
        'your Ethereum provider': 'Frame',
      },
      detect: (p: any) => p.isFrame,
    },
    {
      id: 'injected',
      name: 'Metamask',
      type: 'Desktop',
      image: metamask,
      strings: {
        'your Ethereum provider': 'Metamask',
      },
      detect: (p: any) => p.isMetaMask,
    },
    {
      id: 'status',
      name: 'Status',
      type: 'Mobile',
      image: status,
      strings: {
        'your Ethereum provider': 'Status',
      },
      detect: (p: any) => p.isStatus,
    },
    {
      id: 'cipher',
      name: 'Cipher',
      type: 'Mobile',
      image: cipher,
      strings: {
        'your Ethereum provider': 'Cipher',
      },
      detect: (p: any) => p.isCipher,
    },
    {
      id: 'fortmatic',
      name: 'Fortmatic',
      type: 'Any',
      image: fortmatic,
      strings: {
        'your Ethereum provider': 'Fortmatic',
      },
      detect: (p: any) => p.isFortmatic,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      type: 'Any',
      image: walletConnect,
      strings: {
        'your Ethereum provider': 'WalletConnect',
      },
      detect: (p: any) => p.isWalletConnect,
    },
    {
      id: 'unknown',
      name: 'Install MetaMask',
      type: 'Desktop',
      image: metamask,
      link: {
        chrome:
          'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
        firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
        edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
        default: 'https://metamask.io/download.html',
      },
      strings: {
        'your Ethereum provider': 'your provider',
      },
    },
  ].map((provider) => [provider.id, provider]),
);

// Get a providers object for a given ID.
function getProvider(providerId: string) {
  if (providerId === 'injected' && !(window as any).ethereum) return PROVIDERS.get('unknown');
  return PROVIDERS.get(providerId);
}

// Get a string that depends on the current Ethereum provider.
// The default string is used as an identifier (à la gettext).
function getProviderString(string: string, providerId: string = 'unknown') {
  const provider = getProvider(providerId);
  return (provider && provider.strings[string]) || string;
}

// Get an identifier for the provider, if it can be detected.
function identifyProvider(ethers: any) {
  // eslint-disable-next-line no-restricted-syntax
  for (const p of PROVIDERS.values()) {
    if (p.detect?.(ethers)) {
      return p.id;
    }
  }
  return 'unknown';
}

// Get a provider from its useWallet() identifier.
function getProviderFromUseWalletId(id?: string) {
  const ethers = (window as any).ethereum ?? (window as any).web3;
  let provider;
  if (!id && ethers) {
    provider = getProvider(identifyProvider(ethers)) || getProvider('unknown');
  }
  if (id) provider = getProvider(id);
  return provider ?? getProvider('unknown');
}

export { getProvider, identifyProvider, getProviderString, getProviderFromUseWalletId };
export default PROVIDERS;
