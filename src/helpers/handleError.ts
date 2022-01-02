import ß from 'bhala'

import getConstructorName from './getConstructorName.js'
import isBrowser from './isBrowser.js'

function handleError(error: any, scope: string): void
function handleError(error: any, scope: string, isFatal: true): never
/**
 * Handle all kinds of errors. Any error should be caught and handled by this function.
 *
 * @example
 * handleError(err, "controllers/MyClass.myMethod()");
 * handleError(err, "helpers/myFunction()");
 * handleError(err, "scripts/myFileName#oneOfTheScriptFunctions()");
 */
function handleError(error: any, scope: string, isFatal: boolean = false): any {
  let errorString
  switch (true) {
    case typeof error === 'string':
      errorString = error
      break

    case error instanceof Error:
      errorString = error.message
      break

    default:
      // eslint-disable-next-line no-case-declarations
      ß.error(`[nexauth] [helpers/handleError()] This type of error cannot be processed. This should never happen.`)
      ß.error(`[nexauth] [helpers/handleError()] Error Type: ${typeof error}`)
      ß.error(`[nexauth] [helpers/handleError()] Error Constructor: ${getConstructorName(error)}`)
      errorString = String(error)
  }

  ß.error(`[nexauth] [${scope}] ${errorString}`)
  // eslint-disable-next-line no-console
  console.error(error)

  if (isFatal) {
    if (!isBrowser()) {
      return process.exit(1)
    }

    throw new Error(
      'nexauth had to terminate unexpectedly. ' +
        'Please check your logs or file an issue: https://github.com/betagouv/nexauth/issues.',
    )
  }

  return undefined
}

export default handleError
