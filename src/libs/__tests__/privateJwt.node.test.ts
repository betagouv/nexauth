import cuid from 'cuid'
import dayjs from 'dayjs'

import { TokenPayload } from '../../types'
import privateJwt from '../privateJwt'
import publicJwt from '../publicJwt'

describe('libs/PrivateJwt [NODE]', () => {
  const processExit = process.exit

  const userData = {
    email: 'leon.tolstoi@example.org',
    firstName: 'Leo',
    id: cuid(),
    lastName: 'Tolstoy',
  }

  beforeAll(() => {
    process.exit = jest.fn() as never
  })

  afterAll(() => {
    process.exit = processExit
  })

  test('should return a JWT with a valid payload', async () => {
    const result = await publicJwt.verify(await privateJwt.sign(userData.id, 42))
    const expected = {
      exp: expect.any(Number),
      iat: expect.any(Number),
      jti: expect.any(String),
      uid: expect.any(String),
    }

    expect(result).toStrictEqual(expected)

    expect(process.exit).not.toHaveBeenCalled()
  })

  test('should return a JWT with a valid payload including user data', async () => {
    const result = await publicJwt.verify(await privateJwt.sign(userData.id, 42, userData))
    const expected = {
      exp: expect.any(Number),
      iat: expect.any(Number),
      jti: expect.any(String),
      uid: expect.any(String),
      user: userData,
    }

    expect(result).toStrictEqual(expected)

    expect(process.exit).not.toHaveBeenCalled()
  })

  test('should return a JWT expiring in 30 days', async () => {
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60
    const before = dayjs().unix()

    const result = (await publicJwt.verify(await privateJwt.sign(userData.id, thirtyDaysInSeconds))) as TokenPayload

    const after = dayjs().unix()

    expect(result.iat).toBeGreaterThanOrEqual(before)
    expect(result.iat).toBeLessThanOrEqual(after)
    expect(result.exp - result.iat).toBe(thirtyDaysInSeconds)

    expect(process.exit).not.toHaveBeenCalled()
  })
})
