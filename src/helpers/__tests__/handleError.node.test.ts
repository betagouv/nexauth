/* eslint-disable max-classes-per-file, no-console */

import { B } from 'bhala'

import handleError from '../handleError'

describe('helpers/handleError() [NODE]', () => {
  const bhalaError = B.error
  const consoleError = console.error
  const processExit = process.exit

  beforeAll(() => {
    B.error = jest.fn()
    console.error = jest.fn()
    process.exit = jest.fn() as never
  })

  afterAll(() => {
    B.error = bhalaError
    console.error = consoleError
    process.exit = processExit
  })

  test('should log expected outputs with a string error', () => {
    const error = 'A string error.'

    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(B.error).toHaveBeenCalledWith('[nexauth] [a/path] A string error.')

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith('A string error.')

    expect(process.exit).not.toHaveBeenCalled()
  })

  test('should log expected outputs with an instance of Error error', () => {
    const error = new Error(`An Error message.`)

    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(B.error).toHaveBeenCalledWith('[nexauth] [a/path] An Error message.')

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(expect.any(Error))

    expect(process.exit).not.toHaveBeenCalled()
  })

  test('should log expected outputs with an CustomError error', () => {
    class CustomError extends Error {}

    const error = new CustomError(`A CustomError message.`)
    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(B.error).toHaveBeenCalledWith('[nexauth] [a/path] A CustomError message.')

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(expect.any(Error))

    expect(process.exit).not.toHaveBeenCalled()
  })

  test('should log expected outputs with a TooCustomError error', () => {
    class TooCustomError {}

    const error = new TooCustomError()
    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(4)
    expect(B.error).toHaveBeenNthCalledWith(
      1,
      '[nexauth] [helpers/handleError()] This type of error cannot be processed. This should never happen.',
    )
    expect(B.error).toHaveBeenNthCalledWith(2, '[nexauth] [helpers/handleError()] Error Type: object')
    expect(B.error).toHaveBeenNthCalledWith(3, '[nexauth] [helpers/handleError()] Error Constructor: TooCustomError')
    expect(B.error).toHaveBeenNthCalledWith(4, '[nexauth] [a/path] [object Object]')

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(expect.any(TooCustomError))

    expect(process.exit).not.toHaveBeenCalled()
  })

  test('should log expected outputs with an undefined error', () => {
    handleError(undefined, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(4)
    expect(B.error).toHaveBeenNthCalledWith(
      1,
      '[nexauth] [helpers/handleError()] This type of error cannot be processed. This should never happen.',
    )
    expect(B.error).toHaveBeenNthCalledWith(2, '[nexauth] [helpers/handleError()] Error Type: undefined')
    expect(B.error).toHaveBeenNthCalledWith(3, '[nexauth] [helpers/handleError()] Error Constructor: undefined')
    expect(B.error).toHaveBeenNthCalledWith(4, '[nexauth] [a/path] undefined')

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(undefined)

    expect(process.exit).not.toHaveBeenCalled()
  })

  test('should log and exit in node', () => {
    const error = 'A string error.'

    handleError(error, `a/path`, true) as any

    expect(process.exit).toHaveBeenCalledTimes(1)
    expect(process.exit).toHaveBeenCalledWith(1)
  })
})
