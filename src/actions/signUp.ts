/* eslint-env node */

import ß from 'bhala'
import { omit, pick } from 'ramda'

import encrypt from '../helpers/encrypt.js'
import ApiError from '../libs/ApiError.js'
import ApiResponse from '../libs/ApiResponse.js'

import type { Adapter, UserWithPassword } from '../types'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const { CI } = process.env

export const excludePassword = omit(['password'])

export default async function signUp<U extends UserWithPassword = UserWithPassword>(
  req: NextApiRequest,
  res: NextApiResponse,
  adapter: Adapter,
  {
    customSignUp,
    firstUserDefaultProps,
    newUserAllowedProps,
  }: {
    customSignUp?: NextApiHandler
    firstUserDefaultProps: Record<string, any>
    newUserAllowedProps: Array<keyof U>
  },
) {
  try {
    if (customSignUp !== undefined) {
      await customSignUp(req, res)

      return
    }

    const {
      body,
    }: {
      body: {
        email?: string
        password?: string
      }
    } = req
    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
      res.status(422).json(new ApiError('Unprocessable Entity.', 422))

      return
    }

    const usersCount = await adapter.user.count()
    const isFirstUser = usersCount === 0

    const userWithSameEmail = await adapter.user.find({
      email: body.email,
    })
    if (userWithSameEmail !== null) {
      res.status(409).json(new ApiError('Conflict.', 409))

      return
    }

    const newUserData = pick(newUserAllowedProps)(body)
    const newUserDataWithoutPassword = excludePassword(newUserData)
    const passwordHash = await encrypt((newUserData as U).password)
    const newUser = await adapter.user.create({
      ...newUserDataWithoutPassword,
      ...(isFirstUser ? firstUserDefaultProps : {}),
      password: passwordHash,
    })

    const newUserWithoutPassword = excludePassword(newUser)

    res.status(201).json(new ApiResponse(newUserWithoutPassword))
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
