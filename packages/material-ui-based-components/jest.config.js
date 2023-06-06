module.exports = {
  preset: 'ts-jest',
  coverageDirectory: 'target/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  testEnvironment: 'jsdom',
  collectCoverage: false,
  coveragePathIgnorePatterns : ['__tests__/*'],
  testRegex: '__tests__/[^.]+\\.test\\.tsx',
  moduleNameMapper : {
    '\\.css' : '<rootDir>/__tests__/mocks/styleMock.js',
    '^react$': '<rootDir>/node_modules/react',
    '^react-intl$': '<rootDir>/node_modules/react-intl'
  },
  reporters : ['default', 'jest-junit'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js']
};
