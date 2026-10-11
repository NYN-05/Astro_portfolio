import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...astroPlugin.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.js', '**/*.mjs'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // TypeScript itself resolves undefined identifiers; Web API globals (Request,
      // Response, crypto, ...) used by the Netlify Edge Function are unknown to ESLint.
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    plugins: {
      'jsx-a11y-x': jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      'jsx-a11y-x/no-noninteractive-element-interactions': 'off',
    },
  },
  prettierConfig,
  {
    ignores: ['dist/', 'node_modules/', '.astro/', 'Temp/', '*.config.js', '*.config.mjs', '*.config.ts'],
  },
];