module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	ignorePatterns: ['src/dist/*', '**/node_modules/*'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: '2021',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: [
					'test.{ts,tsx,js,jsx}',
					'test-*.{ts,tsx,js,jsx}',
					'**/*{.,_}{test,spec}.{ts,tsx,js,jsx}',
					'**/jest.config.{ts,js}',
					'**/jest.setup.{ts,js}',
					'**/*.stories.*',
					'**/.storybook/**/*.*',
				],
			},
		],
		'no-console': ['warn', { allow: ['time', 'timeEnd'] }],
		// not sure why we need this if Typescript already enforces it.
		// If we want to enable these rules, we need use: eslint-import-resolver-typescript
		'import/no-unresolved': 'off',
		'import/extensions': 'off',
		// https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/returningpromises.md
		'no-return-await': 'off',
		// Turn it back on after this being fixed: https://github.com/eslint/eslint/issues/15617
		'no-restricted-exports': 'off',
		'no-param-reassign': 'off',
		'no-use-before-define': 'off',
		'import/prefer-default-export': 'off',
		// indent: ['error', 4],
		// 'max-len': [1, 150, 4],
		'class-methods-use-this': 'off',
		'no-useless-constructor': 'off',
		'no-empty-function': 'off',
		camelcase: 'off',
	},
};
