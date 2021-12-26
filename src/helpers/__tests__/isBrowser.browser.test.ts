/**
 * @jest-environment jsdom
 */

import isBrowser from '../isBrowser'

describe('helpers/isBrowser() [BROWSER]', () => {
  test('should return TRUE', async () => {
    const result = isBrowser()

    expect(result).toStrictEqual(true)
  })
})
