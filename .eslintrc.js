module.exports = {
 parser: '@typescript-eslint/parser',
 extends: [
  'plugin:@typescript-eslint/recommended',
  'prettier/@typescript-eslint',
  'plugin:prettier/recommended',
  "eslint:recommended",
  "google",
  "prettier"
 ],
 plugins: ["prettier"],
 parserOptions: {
  ecmaVersion: 2018,
  sourceType: 'module',
 },
 rules: {
  "no-console": 0,
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
