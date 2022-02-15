/**
 * @jest-environment jsdom
 */

import { B } from 'bhala'
import { importPKCS8, SignJWT } from 'jose'

import jwt from '../jwt'

const signDummyToken = async (payload: Record<string, any>) => {
  const privateKey = await importPKCS8(process.env.EDDSA_PRIVATE_KEY as string, 'EdDSA')

  const token = await new SignJWT(payload)
    .setProtectedHeader({
      alg: 'EdDSA',
    })
    .sign(privateKey)

  return token
}

describe('libs/Jwt [BROWSER]', () => {
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

  describe('.parse()', () => {
    test('should return the expected payload with a parseable token', async () => {
      const payload = {
        aCustomProp: 42,
      }
      const parseableToken = await signDummyToken(payload)

      const result = jwt.parse(parseableToken)

      expect(result).toStrictEqual(payload)
    })

    test('should return undefined with an unparseable token', () => {
      const unparseableToken = ''

      const result = jwt.parse(unparseableToken)

      expect(result).toBeUndefined()
    })
  })

  describe('.sign()', () => {
    test('should throw an error when called within a browser environment', async () => {
      await expect(jwt.sign).rejects.toThrow()

      expect(B.error).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('.verify()', () => {
    test('should throw an error when called within a browser environment', async () => {
      await expect(jwt.verify).rejects.toThrow()

      expect(B.error).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledTimes(1)
    })
  })
})
