import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'build',
      '.react-router'
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.recommended,
      jsxA11y.flatConfigs.recommended,
      stylistic.configs.recommended,
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      }
    },
    rules: {
      '@stylistic/no-extra-parens': ['error', 'functions'],
      '@stylistic/comma-dangle': ['error',
        {
          arrays: 'only-multiline',
          objects: 'only-multiline',
          imports: 'only-multiline',
          exports: 'only-multiline',
          functions: 'never',
          importAttributes: 'only-multiline',
          dynamicImports: 'only-multiline'
        }],
      '@stylistic/array-element-newline': ['error', { consistent: true, multiline: true }],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
      ],
      '@stylistic/multiline-ternary': ['error', 'always-multiline', { ignoreJSX: true }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'react-refresh/only-export-components': ['warn',
        {
          allowConstantExport: true,
          allowExportNames: [
            'loader',
            'clientLoader',
            'action',
            'clientAction',
            'ErrorBoundary',
            'HydrateFallback',
            'headers',
            'handle',
            'links',
            'meta',
            'shouldRevalidate',
          ]
        }],
    },
  }
)
