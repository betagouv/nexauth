import ß from 'bhala'

import help from './help'
import init from './init'

const COMMANDS = ['help', 'init', 'generate']

const [, , command] = process.argv

if (typeof command !== 'string' || !COMMANDS.includes(command)) {
  if (typeof command === 'string' && !COMMANDS.includes(command)) {
    ß.error(`Unknown command "${command}"`)
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
    break

  case 'init':
    init()
    break

  case 'help':
  default:
    help()
}
