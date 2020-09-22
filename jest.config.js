module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|dist|.history)[/\\\\]',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|src/migrations)[/\\\\]',
  ],
  globals: {
    'ts-jest': {
      tsConfig: {
        // Allow forgiving checks in tests (strictly checked on yarn lint & type-check)
        noImplicitAny: false,
        strictNullChecks: false,
        strictFunctionTypes: false,
        noImplicitThis: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noImplicitReturns: false,
        noFallthroughCasesInSwitch: false,
      },
    },
  },
}
