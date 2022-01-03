/* eslint-env node */

import logIn from './actions/logIn.js'
import logOut from './actions/logOut.js'
import refresh from './actions/refresh.js'
import signUp from './actions/signUp.js'
import ApiError from './libs/ApiError.js'

import type { NexauthOptions, UserWithPassword } from './types'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const ACTION = {
  LOG_IN: 'login',
  LOG_OUT: 'logout',
  REFRESH: 'refresh',
  SIGN_UP: 'signup',
}

export default function Nexauth<U extends UserWithPassword = UserWithPassword>(
  options: NexauthOptions<U>,
): NextApiHandler {
  const { adapter, config, customLogIn, customLogOut, customRefresh, customSignUp } = options
  const {
    accessTokenPublicUserProps = ['email', 'id'],
    firstUserDefaultProps = {},
    logInConditions = [],
    newUserAllowedProps = ['email', 'password'],
  } = config || {}

  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'POST') {
      res.status(405).json(new ApiError('Method not allowed.', 405))

      return
    }

    if (!Array.isArray(req.query.nexauth) || req.query.nexauth.length !== 1) {
      res.status(404).json(new ApiError('Not Found.', 404))

      return
    }

    const {
      nexauth: [action],
    } = req.query

    switch (action) {
      case ACTION.LOG_IN:
        return logIn(req, res, adapter, {
          accessTokenPublicUserProps,
          customLogIn,
          logInConditions,
        })

      case ACTION.LOG_OUT:
        return logOut(req, res, adapter, {
          customLogOut,
        })

      case ACTION.REFRESH:
        return refresh(req, res, adapter, {
          accessTokenPublicUserProps,
          customRefresh,
        })

      case ACTION.SIGN_UP:
        return signUp(req, res, adapter, {
          customSignUp,
          firstUserDefaultProps,
          newUserAllowedProps,
        })

      default:
        res.status(404).json(new ApiError('Not Found.', 404))
    }
  }
}
