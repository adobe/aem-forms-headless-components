module.exports = {
  preset: 'react-native',
  coverageDirectory: 'target/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  testEnvironment: 'jsdom',
  collectCoverage: false,
  coveragePathIgnorePatterns : ['__tests__/*'],
  testRegex: '__tests__/[^.]+\\.test\\.tsx',
  reporters : ['default'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js']
};
