/**
 * @jest-environment jsdom
 */

/* eslint-disable no-console */

import ß from 'bhala'

import handleError from '../handleError'

describe('helpers/handleError() [BROWSER]', () => {
  const bhalaError = ß.error
  const consoleError = console.error
  const processExit = process.exit

  beforeAll(() => {
    ß.error = jest.fn()
    console.error = jest.fn()
    process.exit = jest.fn() as never
  })

  afterAll(() => {
    ß.error = bhalaError
    console.error = consoleError
    process.exit = processExit
  })

  test('should log and throw in a browser', () => {
    const error = 'A string error.'

    const runner = () => handleError(error, `a/path`, true) as any

    expect(runner).toThrowError(
      'nexauth had to terminate unexpectedly. ' +
        'Please check your logs or file an issue: https://github.com/betagouv/nexauth/issues.',
    )

    expect(process.exit).not.toHaveBeenCalled()
  })
})
