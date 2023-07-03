// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.e2e.config');

module.exports = {
  ...config,
  coverageDirectory: '<rootDir>/coverage/all',
  testRegex: 'spec.ts$',
  coverageThreshold: {
    global: {
      statements: 98.16,
      branches: 89.09,
      functions: 97.46,
      lines: 98.04,
    },
  },
};
