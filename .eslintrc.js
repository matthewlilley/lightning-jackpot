const path = require('path')

module.exports = {
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  // parserOptions: {
  //   project: path.resolve(__dirname, './tsconfig.json'),
  //   tsconfigRootDir: __dirname,
  //   ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
  //   sourceType: 'module', // Allows for the use of imports
  // },
  rules: {
    'sort-imports': [
      1,
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
}
