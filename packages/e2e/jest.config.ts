import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  preset: '@chainsafe/dappeteer',
  testTimeout: 300000, // 10 minutes
  setupFilesAfterEnv: ['expect-puppeteer'],
  testSequencer: './helpers/test-sequencer.js',
  testRunner: 'jest-circus/runner',
  testEnvironment: './helpers/dappeteer-screenshot-on-failure-test-env.js',
  globalTeardown: './helpers/keep-browser-open-teardown.js',
  reporters: ['default', 'github-actions'],
};
export default config;
