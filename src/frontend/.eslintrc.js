module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:react/recommended'],
  plugins: ['react', 'react-hooks'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
