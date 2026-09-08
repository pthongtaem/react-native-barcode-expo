import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}', 'example-expo/**/*.{js,jsx}'],
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['scripts/**/*.cjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['example-expo/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals['shared-node-browser'],
      },
    },
  },
);
