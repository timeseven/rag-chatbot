import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';
import { includeIgnoreFile } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	// Base configs equivalent to older "extends" syntax
	...compat.extends('plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'),
	{
		plugins: {
			prettier,
		},
		rules: {
			'prettier/prettier': 'error',
			'react/react-in-jsx-scope': 'off',
		},
	},
	{
		files: ['metro.config.js', 'tailwind.config.js'],
		rules: {
			'import/no-commonjs': 'off',
			'@typescript-eslint/no-require-imports': 'off',
		},
	},

	// Ignore files specified in .gitignore
	includeIgnoreFile(gitignorePath),
];
