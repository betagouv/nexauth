/* eslint-env node */

import { B } from 'bhala'

import ApiError from '../libs/ApiError.js'
import jwt from '../libs/jwt.js'

import type { Adapter, NexauthOptions, RefreshTokenPayload } from '../types'
import type { NextApiRequest, NextApiResponse } from 'next'

const { CI } = process.env

export default async function logOut(
  req: NextApiRequest,
  res: NextApiResponse,
  adapter: Adapter,
  {
    customLogOut,
  }: {
    customLogOut?: NexauthOptions['customLogOut']
  },
) {
  try {
    if (customLogOut !== undefined) {
      await customLogOut(req, res)

      return
    }

    const refreshTokenValue = String(req.body.refreshToken)
    const refreshTokenPayload = await jwt.verify<RefreshTokenPayload>(refreshTokenValue)
    if (refreshTokenPayload === undefined) {
      res.status(403).json(new ApiError(`Forbidden.`, 403))

      return
    }

    await adapter.refreshToken.deleteMany({
      familyId: refreshTokenPayload.data.familyId,
    })

    res.status(204).end()
  } catch (err) {
    B.error(String(err))
    console.error(err)

    if (CI && err instanceof Error) {
      res.status(500).json(new ApiError('Something went wrong.', 500, err))

      return
    }

    res.status(500).json(new ApiError('Something went wrong. Please check your logs.', 500))
  }
}
