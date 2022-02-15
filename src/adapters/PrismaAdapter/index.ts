/* eslint-env node */

import Operator from './Operator.js'

import type { Adapter, AdapterOperator, RefreshToken, UserWithPassword } from '../../types'

export default class PrismaAdapter<U extends UserWithPassword = UserWithPassword> implements Adapter {
  private refreshTokenOperator: Operator<RefreshToken>
  private userOperator: Operator<U>

  constructor({ prismaInstance }: { prismaInstance: any }) {
    this.refreshTokenOperator = new Operator(prismaInstance, 'refreshToken')
    this.userOperator = new Operator(prismaInstance, 'user')
  }

  public get refreshToken(): AdapterOperator<RefreshToken> {
    return this.refreshTokenOperator
  }

  public get user(): AdapterOperator<U> {
    return this.userOperator
  }
}
