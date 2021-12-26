import { promises as fs } from 'fs'

/**
 * Check if the given <path> is a file.
 */
export default async function isFile(path: string): Promise<boolean> {
  try {
    const fileStats = await fs.lstat(path)

    return fileStats.isFile()
  } catch (err) {
    return false
  }
}
