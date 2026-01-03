module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:sonarjs/recommended',
        "eslint:recommended",
        "google",
        "prettier"
    ],
    plugins: ["prettier", "sonarjs"],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json'
    },
    rules: {
        "no-console": 0,
        // sonarjs rules to detect duplicates and identical code patterns
        'sonarjs/no-duplicated-branches': 'error',
        'sonarjs/no-identical-functions': 'error',
        'sonarjs/no-duplicate-string': ['warn', 3],
        'sonarjs/cognitive-complexity': 'off',
        'sonarjs/no-collapsible-if': 'off',
        'valid-jsdoc': 0,
        '@typescript-eslint/no-unsafe-function-type': 0,
        'require-jsdoc': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-unused-vars': 0,
        'no-invalid-this': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-explicit-any': 0,
        'no-unused-vars': 0,
        'guard-for-in': 0
    },
    env: {
        browser: true,
        es6: true
    }
};
