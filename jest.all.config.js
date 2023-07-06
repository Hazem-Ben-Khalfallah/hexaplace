// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.e2e.config');

module.exports = {
  ...config,
  coverageDirectory: '<rootDir>/coverage/all',
  testRegex: 'spec.ts$',
  coverageThreshold: {
    global: {
      statements: 96.19,
      branches: 90.9,
      functions: 91.42,
      lines: 96.35,
    },
  },
};
