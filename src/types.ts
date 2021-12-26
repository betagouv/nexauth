import { JWTPayload } from 'jose'

export interface IdTokenPayload<T extends Record<string, any>> extends TokenPayload {
  user: T
}

export interface TokenPayload extends JWTPayload {
  /**
   * Expiration date
   *
   * @description
   * Unix timestamp (in seconds)
   */
  exp: number
  /**
   * Creation date
   *
   * @description
   * Unix timestamp (in seconds)
   */
  iat: number
  /** Token CUID */
  jti: string
  /** User CUID */
  uid: string
}
