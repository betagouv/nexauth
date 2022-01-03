/* eslint-disable no-console */

import help from '../help'

describe('commands/help() [NODE]', () => {
  const consoleLog = console.log

  beforeAll(() => {
    console.log = jest.fn()
  })

  afterAll(() => {
    console.log = consoleLog
  })

  test('should return a valid hash', () => {
    help()

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toBeCalledWith(expect.any(String))
  })
})
