/* eslint-env node */

import handleError from '../helpers/handleError.js'
import isBrowser from '../helpers/isBrowser.js'
import jwt from './jwt.js'

import type { AccessTokenPayload, User } from '../types'
import type { NextApiRequest } from 'next'

export default async function getUser<U extends Record<string, any> = User>(
  req: NextApiRequest,
): Promise<U | undefined> {
  if (isBrowser()) {
    return handleError(new Error('You cannot use getUser() in a browser envriroment.'), 'libs/getUser()', true)
  }

  try {
    const authorizationHeader = req.headers.authorization

    if (authorizationHeader === undefined || !/^Bearer .+$/.test(authorizationHeader)) {
      return undefined
    }

    const maybeSessionTokenResult = /^Bearer (.+)$/.exec(authorizationHeader)
    if (maybeSessionTokenResult === null) {
      return undefined
    }

    const sessionToken = maybeSessionTokenResult[1]
    const maybeAccessTokenPayload = await jwt.verify<AccessTokenPayload<U>>(sessionToken)
    if (maybeAccessTokenPayload === undefined) {
      return undefined
    }

    return maybeAccessTokenPayload.data
  } catch (err) {
    handleError(err, 'libs/getUser()', true)
  }
}
