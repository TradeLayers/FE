import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', '.husky/**', '*.js'],
    },

    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
        },
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.node.json', './tsconfig.app.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',

            ...reactHooks.configs.recommended.rules,
            'react/jsx-uses-react': 'off', // Not needed in modern React
            'react/react-in-jsx-scope': 'off',
        },
    },
    prettierConfig,
];
