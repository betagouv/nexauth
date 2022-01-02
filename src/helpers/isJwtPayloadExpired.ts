import getUnixTime from './getUnixTime.js'

import type { TokenPayload } from '../types'

export default function isTokenPayloadExpired<P extends TokenPayload = TokenPayload>(payload: P): boolean {
  const now = getUnixTime()

  return payload.exp <= now
}
