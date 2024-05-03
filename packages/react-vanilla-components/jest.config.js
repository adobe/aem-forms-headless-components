const esModules = ['@adobe/json-formula', '@aemforms/af-formatters', '@hcaptcha/loader'].join('|');

module.exports = {
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(m?js|jsx)$': 'babel-jest'
  },
  coverageDirectory: 'target/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  testEnvironment: 'jsdom',
  collectCoverage: false,
  coveragePathIgnorePatterns : ['__tests__/*'],
  testRegex: '__tests__/[^.]+\\.test\\.tsx',
  moduleNameMapper : {
    '\\.css' : '<rootDir>/__tests__/mocks/styleMock.js',
    // Mock static file imports and assets which Jest can’t handle
    // stylesheets use the package identity-obj-proxy
    '@spectrum-css/.*': 'identity-obj-proxy',
    '^react$': '<rootDir>/node_modules/react',
    '^react-intl$': '<rootDir>/node_modules/react-intl',
    '^@hcaptcha/react-hcaptcha$': '<rootDir>/__tests__/mocks/@hcaptcha/react-hcaptcha.js'
  },
  reporters : ['default', 'jest-junit'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js']
};