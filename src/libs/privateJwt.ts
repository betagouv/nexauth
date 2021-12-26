/* eslint-env  node */

import cuid from 'cuid'
import { importJWK, JWTHeaderParameters, KeyLike, SignJWT } from 'jose'

import getUnixTime from '../helpers/getUnixTime'
import handleError from '../helpers/handleError'
import isBrowser from '../helpers/isBrowser'

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

      const privateKeyPath = `${process.cwd()}/.nexauth.private.json`
      const privateKeyAsJwk = await import(privateKeyPath)
      const privateKeyAsJoseKey = await importJWK(privateKeyAsJwk, 'EdDSA')

      this.privateKey = privateKeyAsJoseKey

      return this.privateKey
    } catch (err) {
      handleError(err, 'libs/PrivateJwt.getPublicKey()', true)
    }
  }
}

export default new PrivateJwt()
