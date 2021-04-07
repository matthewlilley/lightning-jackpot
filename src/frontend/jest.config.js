const config = require('../../jest.config')

module.exports = {
  ...config,
  rootDir: '../..',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/frontend/tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  roots: ['<rootDir>/src/frontend'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupEnzyme.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  verbose: true,
  bail: false,
  testURL: 'https://localhost/',
}
