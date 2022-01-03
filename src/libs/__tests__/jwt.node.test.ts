import cuid from 'cuid'
import dayjs from 'dayjs'

import { TokenPayload } from '../../types'
import jwt from '../jwt'

describe('libs/Jwt [NODE]', () => {
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

  afterEach(() => {
    expect(process.exit).not.toHaveBeenCalled()
  })

  describe('.parse()', () => {
    test('should return the expected payload with a parseable token', async () => {
      const parseableToken = await jwt.sign(userData.id, 60, userData)

      const result = jwt.parse(parseableToken)
      const expected = {
        data: userData,
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.any(String),
        uid: userData.id,
      }

      expect(result).toStrictEqual(expected)
    })

    test('should return undefined with an unparseable token', () => {
      const unparseableToken = ''

      const result = jwt.parse(unparseableToken)

      expect(result).toBeUndefined()
    })
  })

  describe('.sign()', () => {
    test('should return a JWT with a valid payload', async () => {
      const result = await jwt.verify(await jwt.sign(userData.id, 60))
      const expected = {
        data: {},
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.any(String),
        uid: userData.id,
      }

      expect(result).toStrictEqual(expected)
    })

    test('should return a JWT with a valid payload including user data', async () => {
      const result = await jwt.verify(await jwt.sign(userData.id, 60, userData))
      const expected = {
        data: userData,
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.any(String),
        uid: userData.id,
      }

      expect(result).toStrictEqual(expected)
    })

    test('should return a JWT expiring in 30 days', async () => {
      const thirtyDaysInSeconds = 30 * 24 * 60 * 60
      const before = dayjs().unix()

      const result = (await jwt.verify(await jwt.sign(userData.id, thirtyDaysInSeconds))) as TokenPayload

      const after = dayjs().unix()

      expect(result.iat).toBeGreaterThanOrEqual(before)
      expect(result.iat).toBeLessThanOrEqual(after)
      expect(result.exp - result.iat).toBe(thirtyDaysInSeconds)
    })
  })

  describe('.verify()', () => {
    test('should return undefined with a malformed token', async () => {
      const malformedToken = ''

      const result = await jwt.verify(malformedToken)

      expect(result).toBeUndefined()
    })

    test('should return undefined with an expired token', async () => {
      const expiredToken = await jwt.sign('', -60)

      const result = await jwt.verify(expiredToken)

      expect(result).toBeUndefined()
    })

    test('should return the expected payload with an expired token with <canBeExpired>=`true`', async () => {
      const expiredToken = await jwt.sign(userData.id, -60)

      const result = await jwt.verify(expiredToken, true)
      const expected = {
        data: {},
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.any(String),
        uid: userData.id,
      }

      expect(result).toStrictEqual(expected)
    })
  })
})
