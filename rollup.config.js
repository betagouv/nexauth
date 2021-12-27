import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const FILE_PATHS = ['./src/AuthProvider/index.tsx', './src/libs/privateJwt.ts', './src/libs/publicJwt.ts']

const getConfig = filePath => ({
  external: ['bhala', 'clipboardy', 'cuid', 'jose', 'next/router.js', 'react'],

  input: filePath,

  output: [
    {
      dir: './dist',
      format: 'esm',
      preserveModules: true,
      sourcemap: false,
    },
  ],

  plugins: [
    nodeResolve({
      extensions: ['.js', 'json', '.ts', '.tsx'],
    }),
    // Convert CommonJS to ES6:
    commonjs(),
    // Transpile TS & TSX to JS:
    typescript({
      tsconfig: './tsconfig.dist.json',
    }),
  ],
})

export default FILE_PATHS.map(getConfig)
