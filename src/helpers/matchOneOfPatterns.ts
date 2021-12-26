import handleError from './handleError'

/**
 * Check if the given source string matches any of the given string or regular expression patterns.
 */
export default function matchOneOfPatterns(source: string, patterns: Array<RegExp | string>): boolean {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const pattern of patterns) {
      if (typeof pattern === 'string') {
        if (source === pattern) {
          return true
        }
      }

      if (pattern instanceof RegExp) {
        if (pattern.test(source)) {
          return true
        }
      }
    }

    return false
  } catch (err) {
    handleError(err, 'helpers/matchOneOfPatterns()', true)
  }
}
