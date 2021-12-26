import path from 'path'

import isDirectory from '../isDirectory'

describe('helpers/isDirectory() [NODE]', () => {
  test('should return TRUE for a directory path', async () => {
    const directoryPath = path.join(__dirname, 'dummies/dummyDirectory')

    const result = await isDirectory(directoryPath)

    expect(result).toStrictEqual(true)
  })

  test('should return FALSE for a file path', async () => {
    const filePath = path.join(__dirname, 'dummies/dummyFile')

    const result = await isDirectory(filePath)

    expect(result).toStrictEqual(false)
  })

  test('should return FALSE for a nonexistent path', async () => {
    const nonexistentPath = path.join(__dirname, 'dummies/nonexistentDirectory')

    const result = await isDirectory(nonexistentPath)

    expect(result).toStrictEqual(false)
  })
})
