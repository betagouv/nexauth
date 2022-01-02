/* eslint-disable max-classes-per-file */

import getConstructorName from '../getConstructorName'

describe('helpers/getConstructorName() [NODE]', () => {
  test('should return "Error" with a native instance of Error', () => {
    const result = getConstructorName(new Error())

    expect(result).toStrictEqual('Error')
  })

  test('should return "CustomError" with an instance of CustomError inheriting Error', () => {
    class CustomError extends Error {}

    const result = getConstructorName(new CustomError())

    expect(result).toStrictEqual('CustomError')
  })

  test('should return "CustomClass" with an instance of CustomClasr', () => {
    class CustomClass {}

    const result = getConstructorName(new CustomClass())

    expect(result).toStrictEqual('CustomClass')
  })

  test('should return "Boolean" with a string', () => {
    const result = getConstructorName(true)

    expect(result).toStrictEqual('Boolean')
  })

  test('should return "String" with a string', () => {
    const result = getConstructorName('A string.')

    expect(result).toStrictEqual('String')
  })

  test('should return "Number" with a number', () => {
    const result = getConstructorName(42)

    expect(result).toStrictEqual('Number')
  })

  test('should return "Object" with a POJO', () => {
    const result = getConstructorName({})

    expect(result).toStrictEqual('Object')
  })

  test('should return "Array" with a POJO array', () => {
    const result = getConstructorName([])

    expect(result).toStrictEqual('Array')
  })

  test('should return "undefined" with a null value', () => {
    const result = getConstructorName(null)

    expect(result).toStrictEqual('undefined')
  })

  test('should return "undefined" with an undefined value', () => {
    const result = getConstructorName(undefined)

    expect(result).toStrictEqual('undefined')
  })
})
