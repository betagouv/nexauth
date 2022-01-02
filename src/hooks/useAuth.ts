/* eslint-env browser */

import { useContext } from 'react'

import Context from '../AuthProvider/Context.js'

import type { AuthContext } from '../AuthProvider/types'
import type { User } from '../types'

/**
 * Provide authentication state, Access Token user data and interaction helpers.
 */
export default function useAuth<U extends User = User>(): AuthContext<U> {
  const contextValue = useContext<AuthContext<U>>(Context as any)

  return contextValue
}
