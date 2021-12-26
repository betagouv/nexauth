/**
 * Get Epoch Unix Time (in seconds).
 */
export default function getUnixTime(): number {
  return Math.floor(Date.now() / 1000)
}
