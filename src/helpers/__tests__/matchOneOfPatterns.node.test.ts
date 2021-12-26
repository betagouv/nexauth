import matchOneOfPatterns from '../matchOneOfPatterns'

describe('helpers/matchOneOfPatterns() [NODE]', () => {
  const patterns = ['aString', /^aRegex/, 'anotherString', /^anotherRegex/]

  test('should return TRUE when matching one of the string patterns', () => {
    const source = 'anotherString'

    const result = matchOneOfPatterns(source, patterns)

    expect(result).toStrictEqual(true)
  })

  test('should return TRUE when matching one of the regex patterns', () => {
    const source = 'anotherRegex with something else'

    const result = matchOneOfPatterns(source, patterns)

    expect(result).toStrictEqual(true)
  })

  test('should return FALSE when matching none of the patterns', () => {
    const source = 'aString with something else'

    const result = matchOneOfPatterns(source, patterns)

    expect(result).toStrictEqual(false)
  })
})
