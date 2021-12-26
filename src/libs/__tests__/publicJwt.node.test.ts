import dayjs from 'dayjs'

import publicJwt from '../publicJwt'

describe('libs/PublicJwt [NODE]', () => {
  const processExit = process.exit

  beforeAll(() => {
    process.exit = jest.fn() as never
  })

  afterAll(() => {
    process.exit = processExit
  })

  describe('.verify()', () => {
    test('should return VOID with a malformed token', async () => {
      const malformedToken = ''

      const result: undefined = (await publicJwt.verify(malformedToken)) as any

      expect(result).toBeUndefined()

      expect(process.exit).not.toHaveBeenCalled()
    })
  })

  describe('.isExpired()', () => {
    test('should return FALSE for an active JWT ', () => {
      const validPayload = {
        exp: dayjs().add(1, 'minute').unix(),
        iat: 0,
        jti: '',
        uid: '',
      }

      const result = publicJwt.isExpired(validPayload)

      expect(result).toBe(false)

      expect(process.exit).not.toHaveBeenCalled()
    })

    test('should return TRUE for an expired JWT', async () => {
      const expiredPayload = {
        exp: dayjs().subtract(1, 'minute').unix(),
        iat: 0,
        jti: '',
        uid: '',
      }

      const result = publicJwt.isExpired(expiredPayload)

      expect(result).toBe(true)

      expect(process.exit).not.toHaveBeenCalled()
    })
  })
})
