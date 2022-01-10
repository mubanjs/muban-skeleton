module.exports = {
  parserOptions: {
    extraFileExtensions: ['.cjs'],
    project: './tsconfig.json',
  },
  extends: [
    '@muban/eslint-config',
  ],
  rules: {
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.ts"]}]
  },
};
