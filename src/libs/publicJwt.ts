/* eslint-env browser, node */

import { importJWK, jwtVerify, KeyLike } from 'jose'

import getUnixTime from '../helpers/getUnixTime'
import handleError from '../helpers/handleError'
import isBrowser from '../helpers/isBrowser'
import { IdTokenPayload, TokenPayload } from '../types'

/**
 * Isomorphic (= both node & browser environments) public JWT library.
 */
class PublicJwt {
  private publicKey?: KeyLike | Uint8Array

  public isExpired<P extends TokenPayload = TokenPayload>(payload: P): boolean {
    const now = getUnixTime()

    return payload.exp <= now
  }

  public async verify(token: string): Promise<TokenPayload | undefined>
  public async verify<U extends Record<string, any> = {}>(token: string): Promise<IdTokenPayload<U> | undefined>
  public async verify(token: string): Promise<any> {
    try {
      const publicKey = await this.getPublicKey()

      const { payload } = (await jwtVerify(token, publicKey)) as any

      return payload

      // https://github.com/panva/jose/blob/main/test/jwt/verify.test.mjs
    } catch (err) {
      // Re-throw expiration errors for `isJwtExpired()` helper
      // `ERR_JWT_EXPIRED` means that this JWT expired
      if (err?.code === 'ERR_JWT_EXPIRED') {
        return undefined
      }

      // Ignore IAT errors to skip client device time synchronization issues
      // if (
      //   err?.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED' &&
      //   err.message === `"iat" claim timestamp check failed (it should be in the past)`
      // ) {
      //   return undefined
      // }

      // `ERR_JWS_SIGNATURE_VERIFICATION_FAILED` means that it's an invalid JWT
      if (err?.code !== 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        return undefined
      }

      // Handle unexpected errors
      handleError(err, 'libs/PublicJwt.parse()', true)
    }
  }

  private async getPublicKey(): Promise<KeyLike | Uint8Array> {
    try {
      if (this.publicKey !== undefined) {
        return this.publicKey
      }

      const publicKeyPath = isBrowser() ? '/nexauth.public.json' : `${process.cwd()}/public/nexauth.public.json`
      const publicKeyAsJwk = await import(publicKeyPath)

      // const publicKey = isBrowser()
      //   ? await importJWKInBrowser(publicKeyAsJwk, 'EdDSA')
      //   : await importJWK(publicKeyAsJwk, 'EdDSA')
      const publicKey = await importJWK(publicKeyAsJwk, 'EdDSA')
      this.publicKey = publicKey

      return publicKey
    } catch (err) {
      handleError(err, 'libs/PublicJwt.getPublicKey()', true)
    }
  }
}

export default new PublicJwt()
