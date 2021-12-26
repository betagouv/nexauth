/**
 * @jest-environment jsdom
 */

/* eslint-disable no-console */

import ß from 'bhala'

describe('libs/PrivateJwt [BROWSER]', () => {
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

  test('should trow an error when imported within a browser environment', async () => {
    const runner = () => import('../privateJwt')

    await expect(runner).rejects.toThrow()
  })
})
