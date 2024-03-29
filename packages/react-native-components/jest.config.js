module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!(@react-native|react-native|@adobe/json-formula|@aemforms/af-formatters)/).*/"
  ],
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  coverageDirectory: 'target/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  testEnvironment: 'jsdom',
  collectCoverage: false,
  coveragePathIgnorePatterns : ['__tests__/*'],
  testRegex: '__tests__/[^.]+\\.test\\.tsx',
  reporters : ['default'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js'],
};
