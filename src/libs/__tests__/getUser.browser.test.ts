/**
 * @jest-environment jsdom
 */

import { B } from 'bhala'

import getUser from '../getUser'

describe('libs/getUser() [BROWSER]', () => {
  const bhalaError = B.error
  const consoleError = console.error

  beforeAll(() => {
    B.error = jest.fn()
    console.error = jest.fn()
  })

  afterAll(() => {
    B.error = bhalaError
    console.error = consoleError
  })

  test('should throw an error when called within a browser environment', async () => {
    await expect(getUser).rejects.toThrow()

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledTimes(1)
  })
})
