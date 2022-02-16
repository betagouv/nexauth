import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import shebang from 'rollup-plugin-preserve-shebang'
import { visualizer } from 'rollup-plugin-visualizer'

const getConfig = input => ({
  external: ['bcryptjs'],

  input,

  output: {
    dir: './dist',
    format: 'es',
  },

  plugins: [
    peerDepsExternal(),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
    json(),
    shebang(),
    typescript({
      tsconfig: './tsconfig.dist.json',
    }),
    ...(input === './src/client.ts'
      ? [
          visualizer({
            gzipSize: true,
          }),
        ]
      : []),
  ],
})

export default ['./src/client.ts', './src/cli.ts', './src/index.ts'].map(getConfig)
