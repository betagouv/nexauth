/* eslint-env browser, node */

import handleError from './handleError.js'

/**
 * Convert a file source to glob patterns (i.e.: reading a `.gitignore` file).
 */
export default function convertSourceToGlobPatterns(source: string): string[] {
  try {
    const patterns = source.split(/\n/).filter(row => row.trim().length !== 0 && !row.trim().startsWith('#'))

    return patterns
  } catch (err) {
    handleError(err, 'helpers/convertSourceToGlobPatterns()', true)
  }
}
