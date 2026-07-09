import domdomegg from 'eslint-config-domdomegg';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
	...domdomegg,
	{
		// serverless.cli.log is deprecated in favour of the Serverless V3 CLI
		// output API, but it remains the supported logging mechanism for
		// plugins targeting the Serverless v2/v3 range this plugin supports.
		// Migrating off it is a behavioural change out of scope for the flat
		// config migration; the v1 preset (older typescript-eslint) did not
		// enforce this rule.
		rules: {
			'@typescript-eslint/no-deprecated': 'off',
		},
	},
];
