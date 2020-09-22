module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|dist|.history)[/\\\\]',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|src/migration)[/\\\\]',
  ],
}
