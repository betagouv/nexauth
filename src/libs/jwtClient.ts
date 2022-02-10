/* eslint-env browser, node */
import jwtDecode from 'jwt-decode'

import handleError from '../helpers/handleError.js'

import type { TokenPayload } from '../types'
import type { KeyLike } from 'jose'

/**
 * JWT browser library.
 */
class JwtClient {
  #algorithm: string
  #isProduction: boolean
  #privateKey?: KeyLike | Uint8Array
  #publicKey?: KeyLike | Uint8Array

  constructor() {
    this.#algorithm = 'EdDSA'
    this.#isProduction = process.env.NODE_ENV === 'production'
  }

  public parse<P extends TokenPayload = TokenPayload>(token: string): P | undefined {
    try {
      const payload = jwtDecode(token) as P

      return payload
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('Invalid token specified')) {
        return undefined
      }

      handleError(err, 'libs/JwtClient.parse()', true)
    }
  }
}

export default new JwtClient()
