// eslint-disable-next-line import/extensions
import basejestConfig from './jest.config.js'

export default {
  ...basejestConfig,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/meta/jest.unit.setup.js'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
}
