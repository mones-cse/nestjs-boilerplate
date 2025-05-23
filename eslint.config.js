const js = require('@eslint/js');
const typescript = require('typescript-eslint');
const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  ...typescript.configs.recommended,
  prettier,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.eslintrc.js', 'eslint.config.js'],
  },
];
