// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.config');

module.exports = {
  ...config,
  coverageDirectory: '<rootDir>/coverage/e2e',
  setupFilesAfterEnv: ['<rootDir>/tests/jestSetupAfterEnv.ts'],
  globalSetup: '<rootDir>/tests/jestGlobalSetup.ts',
  testRegex: '.e2e-spec.ts$',
  testPathIgnorePatterns: ['tests/ignored'],
  coveragePathIgnorePatterns: [
    '.spec.ts',
    '.in-memory.repository.base.ts',
    '.in-memory.repository.ts',
    '.in-memory.gateway.ts',
    '.in-memory.factory.ts',
    '.in-memory.unit-of-work.ts',
    '.in-memory.adapter.ts',
    '.in-memory.service.ts',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/migration.ts',
    '<rootDir>/src/infrastructure/',
    '<rootDir>/src/libs/',
    '<rootDir>/src/infrastructure/database/migrations/',
    '<rootDir>/src/infrastructure/interceptors/exception.interceptor.ts',
    '<rootDir>/src/libs/exceptions/index.ts',
    '<rootDir>/src/libs/decorators/final.decorator.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 92.72,
      branches: 69.86,
      functions: 87.99,
      lines: 92.66,
    },
  },
};
