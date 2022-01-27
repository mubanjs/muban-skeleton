module.exports = {
  extends: [
    '@muban/eslint-config',
  ],
  parserOptions: {
    extraFileExtensions: ['.cjs'],
    project: ['./tsconfig.json', './tsconfig.mocks.json'],
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.ts", "./mocks/**/*.ts", "**/*.stories.ts"]}]
  },
};
