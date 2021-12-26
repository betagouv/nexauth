// eslint-disable-next-line import/extensions
import basejestConfig from './jest.config.js'

export default {
  ...basejestConfig,
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
}
