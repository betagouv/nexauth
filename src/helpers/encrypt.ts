import bcryptjs from 'bcryptjs'

const BCRYPT_SALT_ROUNDS = 10

export default function encrypt(value: string): Promise<string> {
  // Second paramater name is confusing, it's the number of rounds and NOT the salt length
  // https://github.com/feathersjs/feathers/issues/1810#issuecomment-586464032
  return bcryptjs.hash(value, BCRYPT_SALT_ROUNDS)
}
