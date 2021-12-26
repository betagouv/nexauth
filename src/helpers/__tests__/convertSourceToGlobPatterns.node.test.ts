import { promises as fs } from 'fs'
import path from 'path'

import convertSourceToGlobPatterns from '../convertSourceToGlobPatterns'

describe('helpers/convertSourceToGlobPatterns() [NODE]', () => {
  test('should return the expected result', async () => {
    const sourcePath = path.join(__dirname, 'stubs/gitignoreStub')
    const source = await fs.readFile(sourcePath, 'utf-8')

    const result = convertSourceToGlobPatterns(source)
    const expected = ['anExcludedFile.txt', 'anExcludedFileWithATrailingSpace', 'anExcludedDirectory/']

    expect(result).toStrictEqual(expected)
  })
})
