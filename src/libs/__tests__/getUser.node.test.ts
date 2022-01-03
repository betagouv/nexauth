import cuid from 'cuid'

import getUser from '../getUser'
import jwt from '../jwt'

describe('libs/getUser() [NODE]', () => {
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

  test('should return undefined with no Authorization header', async () => {
    const request = {
      headers: {},
    } as any

    const result = await getUser(request)

    expect(result).toBeUndefined()
  })

  test('should return undefined an empty Authorization header', async () => {
    const request = {
      headers: {
        authorization: '',
      },
    } as any

    const result = await getUser(request)

    expect(result).toBeUndefined()
  })

  test('should return undefined a malformed Authorization header', async () => {
    const validToken = await jwt.sign(userData.id, 60, userData)

    const request = {
      headers: {
        authorization: validToken,
      },
    } as any

    const result = await getUser(request)

    expect(result).toBeUndefined()
  })

  test('should return undefined an incomplete Authorization header', async () => {
    const request = {
      headers: {
        authorization: 'Bearer ',
      },
    } as any

    const result = await getUser(request)

    expect(result).toBeUndefined()
  })

  test('should return undefined an invalid Authorization header token', async () => {
    const expiredToken = await jwt.sign(userData.id, -60, userData)

    const request = {
      headers: {
        authorization: `Bearer ${expiredToken}`,
      },
    } as any

    const result = await getUser(request)

    expect(result).toBeUndefined()
  })

  test('should return the expected data with a Authorization header token', async () => {
    const validToken = await jwt.sign(userData.id, 60, userData)

    const request = {
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    } as any

    const result = await getUser(request)

    expect(result).toStrictEqual(userData)
  })
})
