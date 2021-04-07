module.exports = {
  preset: 'jest-puppeteer',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // globals: {
  //   'ts-jest': {
  //     tsConfig: 'tsconfig.test.json',
  //   },
  // },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globalSetup: 'jest-environment-puppeteer/setup',
  globalTeardown: 'jest-environment-puppeteer/teardown',
  testEnvironment: 'jest-environment-puppeteer',
};
