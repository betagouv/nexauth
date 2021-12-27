export default {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  preset: 'ts-jest/presets/js-with-ts-esm',
  rootDir: '..',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/meta/jest.setup.js'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
}
