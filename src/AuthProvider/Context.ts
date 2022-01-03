/* eslint-env browser, node */

import { createContext } from 'react'

import type { AuthContext } from './types'

const anoop: any = () => Promise.resolve()

const Context = createContext<AuthContext>({
  logIn: anoop,
  logOut: anoop,
  refresh: anoop,
  signUp: anoop,
  state: {
    isLoading: true,
  },
})

export default Context
