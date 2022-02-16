import bcryptjs from 'bcryptjs'

const BCRYPT_SALT_ROUNDS = 10

export default async function encrypt(value: string): Promise<string> {
  const salt = await bcryptjs.genSalt(BCRYPT_SALT_ROUNDS)

  const encryptedValue = await bcryptjs.hash(value, salt)

  return encryptedValue
}
