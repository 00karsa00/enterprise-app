import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Import ordering - enforce architecture boundary
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Forbid direct third-party imports in modules (architectural boundary)
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message: 'Use httpClient from @infrastructure/http instead.',
            },
            {
              name: '@tanstack/react-query',
              message: 'Use query wrappers from @infrastructure/query instead.',
            },
            {
              name: 'zustand',
              message: 'Use store wrappers from @infrastructure/store instead.',
            },
            {
              name: 'react-hook-form',
              message: 'Use form components from @shared/components/form instead.',
            },
            {
              name: 'sonner',
              message: 'Use notify from @core/services/notification instead.',
            },
          ],
          patterns: [
            {
              group: ['axios/*'],
              message: 'Use httpClient from @infrastructure/http instead.',
            },
          ],
        },
      ],
    },
  },
  {
    // Allow infrastructure layer to import third-party libs
    files: ['src/infrastructure/**/*', 'src/shared/components/**/*'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },
);
