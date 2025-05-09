import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
      ecmaVersion: 'latest',
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
])
