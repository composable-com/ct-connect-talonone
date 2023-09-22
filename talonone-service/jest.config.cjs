module.exports = {
  displayName: 'Tests Typescript Application - Service',
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,jxs}',
    '!**/node_modules/**',
    '!src/services/commercetools/validators/**',
    '!src/utils/**'
  ]
}
