/* eslint-env node */

import bcryptjs from 'bcryptjs'
import ß from 'bhala'
import cuid from 'cuid'
import { omit, pick } from 'ramda'

import { ACCESS_TOKEN_EXPIRATION_IN_SECONDS, REFRESH_TOKEN_EXPIRATION_IN_SECONDS } from '../constants.js'
import ApiError from '../libs/ApiError.js'
import ApiResponse from '../libs/ApiResponse.js'
import jwt from '../libs/jwt.js'

import type {
  AccessTokenPayload,
  Adapter,
  NexauthConfig,
  NexauthOptions,
  RefreshTokenPayload,
  UserWithPassword,
} from '../types'
import type { NextApiRequest, NextApiResponse } from 'next'

const { CI } = process.env

export const excludePassword = omit(['password'])

export default async function logIn<U extends UserWithPassword = UserWithPassword>(
  req: NextApiRequest,
  res: NextApiResponse,
  adapter: Adapter<U>,
  {
    accessTokenPublicUserProps,
    customLogIn,
    logInConditions,
  }: {
    accessTokenPublicUserProps: NexauthConfig<U>['accessTokenPublicUserProps']
    customLogIn?: NexauthOptions['customLogIn']
    logInConditions: NexauthConfig<U>['logInConditions']
  },
) {
  try {
    if (customLogIn !== undefined) {
      await customLogIn(req, res)

      return
    }

    if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
      res.status(422).json(new ApiError('Unprocessable Entity.', 422))

      return
    }

    const credentials = {
      email: req.body.email,
      password: req.body.password,
    }

    const user = await adapter.user.find({
      email: credentials.email,
    })
    if (user === null) {
      res.status(404).json(new ApiError('Not found.', 404))

      return
    }

    const matchPassword = await bcryptjs.compare(credentials.password, user.password)
    if (!matchPassword) {
      res.status(401).json(new ApiError('Unauthorized.', 401))

      return
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const logInCondition of logInConditions) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await logInCondition(user))) {
        res.status(403).json(new ApiError('Forbidden.', 403))

        return
      }
    }

    const familyId = cuid()
    const ipOrIps = req.headers['x-real-ip'] || '0.0.0.0'
    const ip = Array.isArray(ipOrIps) ? ipOrIps.join(', ') : ipOrIps
    const userId = user.id

    const accessTokenPayloadUser = pick(accessTokenPublicUserProps)(user)
    const accessTokenValue = await jwt.sign(userId, ACCESS_TOKEN_EXPIRATION_IN_SECONDS, accessTokenPayloadUser)
    const accessTokenPayload = await jwt.verify<AccessTokenPayload>(accessTokenValue)

    const refreshTokenValue = await jwt.sign(userId, REFRESH_TOKEN_EXPIRATION_IN_SECONDS)
    const refreshTokenPayload = await jwt.verify<RefreshTokenPayload>(refreshTokenValue)
    if (refreshTokenPayload === undefined) {
      throw new Error('`refreshTokenValue` is unverifiable. This should never happen.')
    }

    const expiredAt = new Date(refreshTokenPayload.exp * 1000)

    await adapter.refreshToken.create({
      expiredAt,
      familyId,
      id: refreshTokenPayload.jti,
      ip,
      userId,
      value: refreshTokenValue,
    })

    res.status(200).json(
      new ApiResponse({
        accessToken: accessTokenValue,
        accessTokenPayload,
        refreshToken: refreshTokenValue,
        refreshTokenPayload,
      }),
    )
  } catch (err) {
    ß.error(String(err))
    console.error(err)

    if (CI && err instanceof Error) {
      res.status(500).json(new ApiError('Something went wrong.', 500, err))

      return
    }

    res.status(500).json(new ApiError('Something went wrong. Please check your logs.', 500))
  }
}
