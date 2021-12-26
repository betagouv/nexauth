/* eslint-env  node */

import cuid from 'cuid'
import { importPKCS8, JWTHeaderParameters, KeyLike, SignJWT } from 'jose'

import getUnixTime from '../helpers/getUnixTime'
import handleError from '../helpers/handleError'
import isBrowser from '../helpers/isBrowser'

const { EDDSA_PRIVATE_KEY, NODE_ENV } = process.env

/**
 * Private JWT library for node environment.
 */
class PrivateJwt {
  private header: JWTHeaderParameters
  private privateKey?: KeyLike | Uint8Array

  constructor() {
    if (isBrowser()) {
      handleError('You cannot use PrivateJwt library in a browser envriroment.', 'libs/PrivateJwt.constructor()', true)
    }

    this.header = {
      alg: 'EdDSA',
    }
  }

  public async sign(userId: string, durationInSeconds: number, userData?: Record<string, any>): Promise<string> {
    try {
      const extirationDate = getUnixTime() + durationInSeconds
      const payload = {
        uid: userId,
        user: userData,
      }
      const privateKey = await this.getPrivateKey()
      const tokenId = cuid()

      const token = await new SignJWT(payload)
        .setProtectedHeader(this.header)
        .setIssuedAt()
        .setExpirationTime(extirationDate)
        .setJti(tokenId)
        .sign(privateKey)

      return token
    } catch (err) {
      handleError(err, 'libs/PrivateJwt.encode()', true)
    }
  }

  private async getPrivateKey(): Promise<KeyLike | Uint8Array> {
    try {
      if (this.privateKey !== undefined) {
        return this.privateKey
      }

      if (EDDSA_PRIVATE_KEY === undefined) {
        throw new Error(
          [
            '`EDDSA_PRIVATE_KEY` environment variable is undefined.',
            NODE_ENV === 'production'
              ? 'This seems to be a production environment. ' +
                'Did you forget to run `npx nexauth generate` and add the EcDSA key pair to your deployment env vars?'
              : 'This seems to be a development environment. Did you forget to run `npx nexauth init`?',
          ].join('\n'),
        )
      }

      this.privateKey = await importPKCS8(EDDSA_PRIVATE_KEY, 'EdDSA')

      return this.privateKey
    } catch (err) {
      handleError(err, 'libs/PrivateJwt.getPublicKey()', true)
    }
  }
}

export default new PrivateJwt()
