export default {
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  preset: 'ts-jest/presets/js-with-ts-esm',
  rootDir: '..',
}
