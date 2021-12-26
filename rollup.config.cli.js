import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  external: ['bhala', 'clipboardy', 'cuid', 'jose', 'next/router', 'react'],

  input: './src/commands/index.ts',

  output: [
    {
      banner: '#!/usr/bin/env node\n',
      file: './dist/cli.js',
      format: 'esm',
      preserveModules: false,
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
      tsconfig: './tsconfig.cli.json',
    }),
  ],
}
