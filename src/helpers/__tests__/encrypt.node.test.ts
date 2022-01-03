import bcryptjs from 'bcryptjs'

import encrypt from '../encrypt'

describe('helpers/encrypt() [NODE]', () => {
  test('should return a valid hash', async () => {
    const password = `agz?PF3AmBY$zPGH`

    const encryptedPassword = await encrypt(password)

    expect(encryptedPassword).not.toStrictEqual(password)

    const result = await bcryptjs.compare(password, encryptedPassword)

    expect(result).toStrictEqual(true)
  })
})
