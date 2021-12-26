import isBrowser from '../isBrowser'

describe('helpers/isBrowser() [NODE]', () => {
  test('should return FALSE', async () => {
    const result = isBrowser()

    expect(result).toStrictEqual(false)
  })
})
