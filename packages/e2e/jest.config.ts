import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  preset: '@chainsafe/dappeteer',
  testTimeout: 300000, // 5 minutes
  setupFilesAfterEnv: ['expect-puppeteer'],
  testSequencer: './helpers/test-sequencer.js',
};
export default config;
