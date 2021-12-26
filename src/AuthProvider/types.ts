/* eslint-env browser, node */

export type AuthContext<U extends Record<string, any> = {}> = {
  logIn: AuthLogInFunction
  logOut: AuthLogOutFunction
  state: AuthState
  user?: U
}

export interface AuthLogInFunction {
  (accessToken: string, refreshToken: string, idToken: string): Promise<void | AuthLogInError>
}

export type AuthLogInError = {
  email?: string
  password?: string
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
