import dayjs from 'dayjs'

import getUnixTime from '../getUnixTime'

describe('helpers/getUnixTime() [NODE]', () => {
  test('should return a number', () => {
    const result = getUnixTime()

    expect(result).toStrictEqual(expect.any(Number))
  })

  test('should return a timestamp between before and after', () => {
    const before = dayjs().unix()

    const result = getUnixTime()

    const after = dayjs().unix()

    expect(result).toBeGreaterThanOrEqual(before)
    expect(result).toBeLessThanOrEqual(after)
  })
})
