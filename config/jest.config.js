export default {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/{commands,helpers,hooks,libs}/**/*.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/src/hooks/useAuth.ts'],
  coverageProvider: 'v8',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
      // https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/#manual-configuration
      useESM: true,
    },
  },
  // https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/#manual-configuration
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  preset: 'ts-jest/presets/js-with-ts-esm',
  rootDir: '..',
  roots: ['<rootDir>/src/commands/', '<rootDir>/src/helpers/', '<rootDir>/src/hooks/', '<rootDir>/src/libs/'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
}
