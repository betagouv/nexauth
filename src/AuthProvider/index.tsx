/* eslint-env browser, node */

import ky, { HTTPError } from 'ky'
import { useRouter } from 'next/router.js'
import React from 'react'

import { NexauthError } from '../constants.js'
import handleError from '../helpers/handleError.js'
import isBrowser from '../helpers/isBrowser.js'
import matchOneOfPatterns from '../helpers/matchOneOfPatterns.js'
import useIsMounted from '../hooks/useIsMounted.js'
import jwt from '../libs/jwt.js'
import Context from './Context.js'

import type ApiResponse from '../libs/ApiResponse'
import type { AccessTokenPayload, User } from '../types'
import type {
  AuthContext,
  AuthLogInError,
  AuthLogInSuccess,
  AuthSignUpError,
  AuthSignUpSuccess,
  AuthState,
} from './types'
import type { FunctionComponent, ReactNode } from 'react'

const INITIAL_STATE: AuthState = {
  isLoading: true,
}

type AuthProviderProps = {
  Loader: any
  SignInDialog: any
  children: ReactNode
  privatePaths: Array<RegExp | string>
}
const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children, Loader, privatePaths, SignInDialog }) => {
  const [state, setState] = React.useState<AuthState>(INITIAL_STATE)
  const [user, setUser] = React.useState<User>()
  const router = useRouter()
  const isMounted = useIsMounted()

  const isPrivatePath = matchOneOfPatterns(router.pathname, privatePaths)
  const mustLogin = isPrivatePath && !state.isAuthenticated

  const providerValue = React.useMemo<AuthContext>(() => {
    async function logIn(email: string, password: string): Promise<AuthLogInSuccess | AuthLogInError> {
      try {
        if (!isBrowser()) {
          throw new Error('logIn() must be called within a browser environment.')
        }

        const { data: tokenPair } = await ky
          .post('/api/auth/login', {
            json: {
              email,
              password,
            },
          })
          .json<
            ApiResponse<{
              accessToken: string
              refreshToken: string
            }>
          >()

        const accessTokenPayload = jwt.parse<AccessTokenPayload>(tokenPair.accessToken)
        if (accessTokenPayload === undefined) {
          throw new Error('`accessToken` is unparseable. This should never happen.')
        }

        window.localStorage.setItem('NEXAUTH_REFRESH_TOKEN', tokenPair.refreshToken)

        if (isMounted()) {
          setUser(accessTokenPayload.data)
          setState({
            accessToken: tokenPair.accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        }

        return {
          isError: false,
        }
      } catch (err) {
        if (err instanceof HTTPError) {
          return {
            error: {
              email: NexauthError.LOG_IN_WRONG_EMAIL_OR_PASSWORD,
            },
            isError: true,
          }
        }

        handleError(err, 'AuthProvider.logIn()')

        return {
          error: {
            email: NexauthError.UNEXPECTED_ERROR,
          },
          isError: true,
        }
      }
    }

    function logOut(): Promise<void>
    function logOut(redirectionPath: string): Promise<never>
    async function logOut(redirectionPath?: string): Promise<any> {
      try {
        if (!isBrowser()) {
          throw new Error('logOut() must be called within a browser environment.')
        }

        const refreshToken = window.localStorage.getItem('NEXAUTH_REFRESH_TOKEN')
        if (refreshToken !== null) {
          await ky
            .post('/api/auth/logout', {
              json: {
                refreshToken,
              },
            })
            .json()
        }

        window.localStorage.removeItem('NEXAUTH_REFRESH_TOKEN')

        // Prevent any DOM event to be passed as first parameter by mistake when logOut() is called as an event listener
        // i.e.: `<button onClick={logOut} />`
        if (redirectionPath !== undefined && typeof redirectionPath === 'string') {
          if (isMounted()) {
            setState(INITIAL_STATE)
          }

          await router.push(redirectionPath)

          return undefined as never
        }

        if (isMounted()) {
          setUser(undefined)
          setState({
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } catch (err) {
        handleError(err, 'AuthProvider.logOut()')
      }
    }

    async function refresh(): Promise<void> {
      try {
        if (!isBrowser()) {
          throw new Error('refresh() must be called within a browser environment.')
        }

        const refreshToken = window.localStorage.getItem('NEXAUTH_REFRESH_TOKEN')
        if (refreshToken === null) {
          setState({
            isAuthenticated: false,
            isLoading: false,
          })

          return
        }

        const { data: tokenPair } = await ky
          .post('/api/auth/refresh', {
            json: {
              refreshToken,
            },
          })
          .json<ApiResponse>()

        const accessTokenPayload = jwt.parse<AccessTokenPayload>(tokenPair.accessToken)
        if (accessTokenPayload === undefined) {
          throw new Error('`accessToken` is unparseable. This should never happen.')
        }

        window.localStorage.setItem('NEXAUTH_REFRESH_TOKEN', tokenPair.refreshToken)

        if (isMounted()) {
          setUser(accessTokenPayload.data)
          setState({
            accessToken: tokenPair.accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        }
      } catch (err) {
        if (err instanceof HTTPError) {
          window.localStorage.removeItem('NEXAUTH_REFRESH_TOKEN')

          if (isMounted()) {
            setState({
              isAuthenticated: false,
              isLoading: false,
            })
          }

          return
        }

        handleError(err, 'AuthProvider.refresh()')
      }
    }

    async function signUp<U extends Record<string, any> = User>(
      newUserData: U,
    ): Promise<AuthSignUpSuccess<U> | AuthSignUpError<U>> {
      try {
        if (!isBrowser()) {
          throw new Error('logIn() must be called within a browser environment.')
        }

        const { data: newUser } = await ky
          .post('/api/auth/signup', {
            json: newUserData,
          })
          .json<ApiResponse<U>>()

        return {
          data: newUser,
          isError: false,
        }
      } catch (err) {
        if (err instanceof HTTPError) {
          if (err.response.status === 409) {
            return {
              error: {
                email: NexauthError.SIGN_UP_DUPLICATE_EMAIL,
              },
              isError: true,
            }
          }

          return {
            error: {
              email: NexauthError.UNEXPECTED_ERROR,
            },
            isError: true,
          }
        }

        handleError(err, 'AuthProvider.signUp()')

        return {
          error: {
            email: NexauthError.UNEXPECTED_ERROR,
          },
          isError: true,
        }
      }
    }

    return {
      logIn,
      logOut,
      refresh,
      signUp,
      state,
      user,
    }
  }, [state])

  React.useEffect(() => {
    if (!state.isLoading) {
      return
    }

    providerValue.refresh()
  }, [state.isLoading])

  if (isPrivatePath && state.isLoading) {
    return <Loader />
  }

  if (mustLogin) {
    return (
      <Context.Provider value={providerValue}>
        <SignInDialog />
      </Context.Provider>
    )
  }

  return <Context.Provider value={providerValue}>{children}</Context.Provider>
}

export default AuthProvider
