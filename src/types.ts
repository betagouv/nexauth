import type { JWTPayload } from 'jose'
import type { NextApiHandler } from 'next'

export type AccessTokenPayload<U extends User = User> = TokenPayload<U>

export interface Adapter {
  refreshToken: AdapterOperator<RefreshToken>
  user: AdapterOperator<UserWithPassword>
}

export interface AdapterOperator<T> {
  count: () => Promise<number>
  create: (data: Record<string, any>) => Promise<T>
  delete: (where: Record<string, any>) => Promise<T | null>
  deleteMany: (where: Record<string, any>) => Promise<T[]>
  find: (where: Record<string, any>) => Promise<T | null>
  findMany: (where: Record<string, any>) => Promise<T[]>
}

export type NexauthConfig<U extends UserWithPassword = UserWithPassword> = {
  accessTokenPublicUserProps: Array<keyof U>
  firstUserDefaultProps: Partial<U>
  logInConditions: Array<<U extends UserWithPassword = UserWithPassword>(user: U) => boolean | Promise<boolean>>
  newUserAllowedProps: string[]
}

export type NexauthOptions<U extends UserWithPassword = UserWithPassword> = {
  adapter: Adapter
  config?: Partial<NexauthConfig<U>>
  customLogIn?: NextApiHandler
  customLogOut?: NextApiHandler
  customRefresh?: NextApiHandler
  customSignUp?: NextApiHandler
}

export interface RefreshToken {
  expiredAt: Date
  familyId: string
  id: string
  ip: string
  userId: string
  value: string
}

export type RefreshTokenPayload = TokenPayload<{
  familyId: string
}>

export interface TokenPayload<D extends Record<string, any> = {}> extends JWTPayload {
  data: D
  /**
   * Expiration date
   *
   * @description
   * Unix timestamp (in seconds)
   */
  exp: number
  /**
   * Creation date
   *
   * @description
   * Unix timestamp (in seconds)
   */
  iat: number
  /** Token CUID */
  jti: string
  /** User CUID */
  uid: string
}

export interface User {
  email: string
  id: string
}
export interface UserWithPassword extends User {
  password: string
}
