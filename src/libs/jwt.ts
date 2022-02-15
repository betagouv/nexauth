/* eslint-env browser, node */

import cuid from 'cuid'
import { errors, jwtVerify, SignJWT, JWTVerifyOptions, importPKCS8, importSPKI } from 'jose'
import jwtDecode from 'jwt-decode'

import getUnixTime from '../helpers/getUnixTime.js'
import handleError from '../helpers/handleError.js'
import isBrowser from '../helpers/isBrowser.js'

import type { TokenPayload } from '../types'
import type { JWTHeaderParameters, KeyLike } from 'jose'

/**
 * JWT Node.js library.
 */
class Jwt {
  private algorithm: string
  private isProduction: boolean
  private privateKey?: KeyLike | Uint8Array
  private publicKey?: KeyLike | Uint8Array

  constructor() {
    this.algorithm = 'EdDSA'
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  public parse<P extends TokenPayload = TokenPayload>(token: string): P | undefined {
    try {
      const payload = jwtDecode(token) as P

      return payload
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('Invalid token specified')) {
        return undefined
      }

      handleError(err, 'libs/Jwt.parse()', true)
    }
  }

  public async sign(userId: string, durationInSeconds: number, data: Record<string, any> = {}): Promise<string> {
    if (isBrowser()) {
      handleError(new Error('You cannot use sign() in a browser envriroment.'), 'libs/Jwt.sign()', true)
    }

    try {
      const extirationDate = getUnixTime() + durationInSeconds
      const header: JWTHeaderParameters = {
        alg: this.algorithm,
      }
      const payload = {
        data,
        uid: userId,
      }
      const privateKey = await this.getPrivateKey()
      const tokenId = cuid()

      const token = await new SignJWT(payload)
        .setProtectedHeader(header)
        .setIssuedAt()
        .setExpirationTime(extirationDate)
        .setJti(tokenId)
        .sign(privateKey)

      return token
    } catch (err) {
      handleError(err, 'libs/Jwt.sign()', true)
    }
  }

  public async verify<P extends TokenPayload = TokenPayload>(
    token: string,
    canBeExpired: boolean = false,
  ): Promise<P | undefined> {
    // Jose doesn't support either OKP JWK or EdDSA (Edwards-curve DSA) in browser yet
    // https://github.com/panva/jose/issues/263
    // It may be worth checking: https://github.com/paulmillr/noble-ed25519
    if (isBrowser()) {
      handleError(new Error('You cannot use verify() in a browser envriroment.'), 'libs/Jwt.verify()', true)
    }

    try {
      const publicKey = await this.getPublicKey()
      // https://github.com/panva/jose/blob/main/docs/interfaces/jwt_verify.JWTVerifyOptions.md#properties
      const options: JWTVerifyOptions = {
        algorithms: [this.algorithm],
        clockTolerance: canBeExpired ? Infinity : 0,
      }

      const { payload } = (await jwtVerify(token, publicKey, options)) as any

      return payload

      // https://github.com/panva/jose/blob/main/test/jwt/verify.test.mjs
    } catch (err) {
      // https://github.com/panva/jose/blob/main/docs/modules/util_errors.md#classes
      if (err instanceof errors.JWSInvalid || err instanceof errors.JWTExpired) {
        return undefined
      }

      handleError(err, 'libs/Jwt.verify()', true)
    }
  }

  private async getPrivateKey(): Promise<KeyLike | Uint8Array> {
    try {
      if (this.privateKey !== undefined) {
        return this.privateKey
      }

      const privateKeyAsPem = process.env.EDDSA_PRIVATE_KEY
      if (privateKeyAsPem === undefined) {
        throw new Error(
          [
            '`EDDSA_PRIVATE_KEY` environment variable is undefined.',
            this.isProduction
              ? 'This seems to be a production environment. ' +
                'Did you forget to run `npx nexauth generate` and add the EcDSA key pair to your deployment env vars?'
              : 'This seems to be a development environment. Did you forget to run `npx nexauth init`?',
          ].join('\n'),
        )
      }

      this.privateKey = await importPKCS8(privateKeyAsPem, this.algorithm)

      return this.privateKey
    } catch (err) {
      handleError(err, 'libs/Jwt.#getPublicKey()', true)
    }
  }

  private async getPublicKey(): Promise<KeyLike | Uint8Array> {
    try {
      if (this.publicKey !== undefined) {
        return this.publicKey
      }

      const publicKeyAsPem = process.env.NEXT_PUBLIC_EDDSA_PUBLIC_KEY
      if (publicKeyAsPem === undefined) {
        throw new Error(
          [
            '`NEXT_PUBLIC_EDDSA_PUBLIC_KEY` environment variable is undefined.',
            this.isProduction
              ? 'This seems to be a production environment. ' +
                'Did you forget to run `npx nexauth generate` and add the EcDSA key pair to your deployment env vars?'
              : 'This seems to be a development environment. Did you forget to run `npx nexauth init`?',
          ].join('\n'),
        )
      }

      const publicKey = await importSPKI(publicKeyAsPem, this.algorithm)
      this.publicKey = publicKey

      return publicKey
    } catch (err) {
      handleError(err, 'libs/Jwt.#getPublicKey()', true)
    }
  }
}

export default new Jwt()
