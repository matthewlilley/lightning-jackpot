const config = require('../../jest.config')

module.exports = {
  ...config,
  rootDir: '../..',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/backend/tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts', 'node'],
  roots: ['<rootDir>/src/backend'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
  bail: true,
  testURL: 'https://localhost/',
}
