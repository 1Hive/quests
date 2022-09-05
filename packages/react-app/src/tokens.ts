import { TokenModel } from './models/token.model';

export const TOKENS = Object.freeze({
  xdai: {
    native: {
      name: 'xDai',
      symbol: 'XDAI',
      decimals: 18,
    } as TokenModel,
    Dai: {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      token: '0x44fa8e6f47987339850636f88629646662444217',
      decimals: 18,
    } as TokenModel,
    UsdCoin: {
      name: 'USDCoin on xDai',
      symbol: 'USDC',
      token: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
      decimals: 6,
    } as TokenModel,
    Tether: {
      name: 'Tether USD on xDai',
      symbol: 'USDT',
      token: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
      decimals: 6,
    } as TokenModel,
    Honey: {
      name: 'Honey',
      symbol: 'HNY',
      token: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
      decimals: 18,
    } as TokenModel,
  },
  rinkeby: {
    native: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    } as TokenModel,
    HoneyTest: {
      name: 'HoneyTest',
      symbol: 'HNYT',
      token: '0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9',
      decimals: 18,
    } as TokenModel,
    Dai: {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      token: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
      decimals: 18,
    } as TokenModel,
    UsdCoin: {
      name: 'USDC Stablecoin',
      symbol: 'USDC',
      token: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
      decimals: 6,
    } as TokenModel,
  },
  goerli: {
    Dai: {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      token: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60',
      decimals: 6,
    } as TokenModel,
  },
});

export const StableTokens = Object.freeze({
  gnosis: [TOKENS.xdai.Dai, TOKENS.xdai.Tether, TOKENS.xdai.UsdCoin],
  rinkeby: [TOKENS.rinkeby.UsdCoin],
  goerli: [TOKENS.goerli.Dai],
});
