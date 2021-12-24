module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'google',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '/coverage',
    '/dist',
    '/documentation',
    '/node_modules',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        endOfLine: 'auto',
      },
    ],
    'valid-jsdoc': 'off',
  },
};
