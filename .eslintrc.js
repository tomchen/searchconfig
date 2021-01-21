module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'tsdoc/syntax': 'warn',
  },
  plugins: ['@typescript-eslint', 'prettier', 'eslint-plugin-tsdoc'],
}
