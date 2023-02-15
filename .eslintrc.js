const RULES_STATUS = {
  OFF: 'off',
  WARN: 'warn',
  ERROR: 'error',
}

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': RULES_STATUS.OFF,
    '@typescript-eslint/explicit-function-return-type': RULES_STATUS.OFF,
    '@typescript-eslint/explicit-module-boundary-types': RULES_STATUS.OFF,
    '@typescript-eslint/no-explicit-any': RULES_STATUS.OFF,
    // 'no-var': RULES_STATUS.ERROR,
    // 'capitalized-comments': RULES_STATUS.ERROR,
    // 'no-console': RULES_STATUS.ERROR,
  },
}
