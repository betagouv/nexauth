import { promises as fs } from 'fs'

/**
 * Check if the given <path> is a directory.
 */
export default async function isDirectory(path: string): Promise<boolean> {
  try {
    const fileStats = await fs.lstat(path)

    return fileStats.isDirectory()
  } catch (err) {
    return false
  }
}
