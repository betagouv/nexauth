#!/usr/bin/env node

/* eslint-env node */

import { B } from 'bhala'

import generate from './commands/generate.js'
import help from './commands/help.js'
import init from './commands/init.js'

const COMMANDS = ['help', 'init', 'generate']

const [, , command] = process.argv

if (typeof command !== 'string' || !COMMANDS.includes(command)) {
  if (typeof command === 'string' && !COMMANDS.includes(command)) {
    B.error(`Unknown command "${command}"`)
  }

  help()

  if (typeof command === 'string' && !COMMANDS.includes(command)) {
    process.exit(1)
  } else {
    process.exit()
  }
}

switch (command) {
  case 'generate':
    generate()
    break

  case 'init':
    init()
    break

  case 'help':
  default:
    help()
}
