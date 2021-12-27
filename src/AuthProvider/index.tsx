/* eslint-env browser, node */

import { useRouter } from 'next/router.js'
import React, { FunctionComponent, ReactNode } from 'react'

import handleError from '../helpers/handleError'
import isBrowser from '../helpers/isBrowser'
import matchOneOfPatterns from '../helpers/matchOneOfPatterns'
import useIsMounted from '../hooks/useIsMounted'
import Context from './Context'
import { AuthContext, AuthState } from './types'

const INITIAL_STATE: AuthState = {
  isLoading: true,
}

type AuthProviderProps = {
  Loader: any
  LoginModal: any
  children: ReactNode
  privatePaths: Array<RegExp | string>
}
const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children, Loader, LoginModal, privatePaths }) => {
  const [state, setState] = React.useState<AuthState>(INITIAL_STATE)
  // const [user, setUser] = React.useState<Record<string, any>>()
  const router = useRouter()
  const isMounted = useIsMounted()

  const isPrivatePath = matchOneOfPatterns(router.pathname, privatePaths)
  const mustLogin = isPrivatePath && !state.isAuthenticated

  React.useEffect(() => {
    if (state.isLoading || !mustLogin) {
      return
    }

    router.push('/admin/login')
  }, [isPrivatePath, mustLogin, state])

  const providerValue = React.useMemo<AuthContext>(() => {
    function logOut(): Promise<void>
    function logOut(redirectionPath: string): Promise<never>
    async function logOut(redirectionPath?: string): Promise<any> {
      try {
        if (isBrowser()) {
          throw new Error('logIn() cannot must be called within a browser environment.')
        }

        window.localStorage.removeItem('refreshToken')

        if (isMounted()) {
          setState(INITIAL_STATE)
        }

        if (redirectionPath !== undefined) {
          await router.push('/admin/login')

          return undefined as never
        }
      } catch (err) {
        handleError(err, 'AuthProvider.logOut()')
      }
    }

    return {
      logIn: async (accessToken: string, refreshToken: string, idToken: string): Promise<void> => {
        try {
          if (isBrowser()) {
            throw new Error('logIn() cannot must be called within a browser environment.')
          }

          window.localStorage.setItem('idToken', idToken)
          window.localStorage.setItem('refreshToken', refreshToken)

          if (isMounted()) {
            setState({
              ...state,
              accessToken,
            })
          }
        } catch (err) {
          handleError(err, 'AuthProvider.logIn()')
        }
      },
      logOut,
      state,
    }
  }, [state])

  if (state.isLoading) {
    return <Loader />
  }

  if (mustLogin) {
    return <LoginModal />
  }

  return <Context.Provider value={providerValue}>{children}</Context.Provider>
}

export default AuthProvider
