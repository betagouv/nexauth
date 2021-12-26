import path from 'path'

import isFile from '../isFile'

describe('helpers/isFile() [NODE]', () => {
  test('should return TRUE for a file path', async () => {
    const filePath = path.join(__dirname, 'dummies/dummyFile')

    const result = await isFile(filePath)

    expect(result).toStrictEqual(true)
  })

  test('should return FALSE for a directory path', async () => {
    const directoryPath = path.join(__dirname, 'dummies/dummyDirectory')

    const result = await isFile(directoryPath)

    expect(result).toStrictEqual(false)
  })

  test('should return FALSE for a nonexistent path', async () => {
    const nonexistentPath = path.join(__dirname, 'dummies/nonexistentFile')

    const result = await isFile(nonexistentPath)

    expect(result).toStrictEqual(false)
  })
})
