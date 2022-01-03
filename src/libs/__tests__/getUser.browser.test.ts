/**
 * @jest-environment jsdom
 */

import ß from 'bhala'

import getUser from '../getUser'

describe('libs/getUser() [BROWSER]', () => {
  const bhalaError = ß.error
  const consoleError = console.error

  beforeAll(() => {
    ß.error = jest.fn()
    console.error = jest.fn()
  })

  afterAll(() => {
    ß.error = bhalaError
    console.error = consoleError
  })

  test('should throw an error when called within a browser environment', async () => {
    await expect(getUser).rejects.toThrow()

    expect(ß.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledTimes(1)
  })
})
