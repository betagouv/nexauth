/* eslint-env node */

import ß from 'bhala'
import cuid from 'cuid'
import { omit, pick, prop, sortBy } from 'ramda'

import { ACCESS_TOKEN_EXPIRATION_IN_SECONDS, REFRESH_TOKEN_EXPIRATION_IN_SECONDS } from '../constants.js'
import ApiError from '../libs/ApiError.js'
import ApiResponse from '../libs/ApiResponse.js'
import jwt from '../libs/jwt.js'

import type { Adapter, NexauthConfig, NexauthOptions, RefreshTokenPayload, UserWithPassword } from '../types'
import type { NextApiRequest, NextApiResponse } from 'next'

const { CI } = process.env

export const excludePassword = omit(['password'])

export default async function refresh<U extends UserWithPassword = UserWithPassword>(
  req: NextApiRequest,
  res: NextApiResponse,
  adapter: Adapter,
  {
    accessTokenPublicUserProps,
    customRefresh,
  }: {
    accessTokenPublicUserProps: NexauthConfig<U>['accessTokenPublicUserProps']
    customRefresh?: NexauthOptions['customRefresh']
  },
) {
  try {
    if (customRefresh !== undefined) {
      await customRefresh(req, res)

      return
    }

    const oldRefreshTokenValue = String(req.body.refreshToken)
    const oldRefreshToken = await adapter.refreshToken.find({
      value: oldRefreshTokenValue,
    })
    if (oldRefreshToken === null) {
      res.status(401).json(new ApiError('Unauthorized.', 401))

      return
    }

    // -------------------------------------------------------------------------
    // Automatic Reuse Detection

    const relatedRefreshTokens = await adapter.refreshToken.findMany({
      familyId: oldRefreshToken.familyId,
    })
    const relatedRefreshTokensSortedByExpiredAtDesc = sortBy(prop('expiredAt'))(relatedRefreshTokens).reverse()
    if (relatedRefreshTokensSortedByExpiredAtDesc[0].value !== oldRefreshTokenValue) {
      await adapter.refreshToken.deleteMany({
        familyId: oldRefreshToken.familyId,
      })

      res.status(401).json(new ApiError('Unauthorized.', 401))

      return
    }

    // -------------------------------------------------------------------------

    const oldRefreshTokenPayload = await jwt.verify<RefreshTokenPayload>(oldRefreshTokenValue)
    if (oldRefreshTokenPayload === undefined) {
      throw new Error('`oldRefreshTokenValue` is unverifiable. This should never happen.')
    }

    const user = await adapter.user.find({
      id: oldRefreshTokenPayload.uid,
    })
    if (user === null) {
      await adapter.refreshToken.deleteMany({
        familyId: oldRefreshToken.familyId,
      })

      res.status(401).json(new ApiError('Unauthorized.', 401))

      return
    }

    const ipOrIps = req.headers['x-real-ip'] || '0.0.0.0'
    const ip = Array.isArray(ipOrIps) ? ipOrIps.join(', ') : ipOrIps
    const userId = user.id

    const newAccessTokenPayloadUser = pick(accessTokenPublicUserProps)(user)
    const newAccessTokenValue = await jwt.sign(userId, ACCESS_TOKEN_EXPIRATION_IN_SECONDS, newAccessTokenPayloadUser)
    const newRefreshTokenValue = await jwt.sign(userId, REFRESH_TOKEN_EXPIRATION_IN_SECONDS)
    const newRefreshTokenData = await jwt.verify<RefreshTokenPayload>(newRefreshTokenValue)
    if (newRefreshTokenData === undefined) {
      throw new Error('`newRefreshTokenValue` is unverifiable. This should never happen.')
    }

    const expiredAt = new Date(newRefreshTokenData.exp * 1000)
    const familyId = cuid()

    await adapter.refreshToken.create({
      expiredAt,
      familyId,
      id: newRefreshTokenData.jti,
      ip,
      userId,
      value: newRefreshTokenValue,
    })

    res.status(200).json(
      new ApiResponse({
        accessToken: newAccessTokenValue,
        refreshToken: newRefreshTokenValue,
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
