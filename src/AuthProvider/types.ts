/* eslint-env browser, node */

import type { NexauthError } from '../constants'
import type { User } from '../types'

export type AuthContext<U extends Record<string, any> = User> = {
  logIn: (email: string, password: string) => Promise<AuthLogInSuccess | AuthLogInError>
  logOut: AuthLogOutFunction
  refresh: () => Promise<string | null>
  signUp: <U extends Record<string, any> = User>(newUserData: U) => Promise<AuthSignUpSuccess<U> | AuthSignUpError<U>>
  state: AuthState
  user?: U
}

export type AuthLogInError = {
  error: {
    email?: NexauthError
    password?: NexauthError
  }
  isError: true
}
export type AuthLogInSuccess = {
  isError: false
}

export type AuthSignUpError<U extends Record<string, any> = User> = {
  error: {
    [prop in keyof U]?: NexauthError
  }
  isError: true
}
export type AuthSignUpSuccess<U extends Record<string, any> = User> = {
  data: U
  isError: false
}

export interface AuthLogOutFunction {
  (): Promise<void>
  (redirectionPath: string): Promise<never>
}

export type AuthState = {
  accessToken?: string
  isAuthenticated?: boolean
  isLoading: boolean
}
