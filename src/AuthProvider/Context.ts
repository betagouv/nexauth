/* eslint-env browser, node */

import { createContext } from 'react'

import { AuthContext } from './types'

const noop: any = () => undefined
const anoop: any = () => Promise.resolve()

const Context = createContext<AuthContext>({
  logIn: anoop,
  logOut: noop,
  state: {
    isLoading: true,
  },
})

export default Context
