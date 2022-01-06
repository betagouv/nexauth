/* eslint-env node */

import ß from 'bhala'
import clipboardy from 'clipboardy'
import crypto from 'crypto'

import handleError from '../helpers/handleError.js'

import type { KeyPairSyncResult } from 'crypto'

export default async function generate(): Promise<void> {
  try {
    // https://nodejs.org/api/crypto.html#cryptogeneratekeypairtype-options-callback
    // > It is recommended to encode public keys as 'spki'
    // > and private keys as 'pkcs8' with encryption for long-term storage
    const eddsaKeyPair = crypto.generateKeyPairSync('ed448', {
      modulusLength: 4096,
      privateKeyEncoding: {
        format: 'pem',
        type: 'pkcs8',
      },
      publicKeyEncoding: {
        format: 'pem',
        type: 'spki',
      },
    }) as unknown as KeyPairSyncResult<string, string>

    await clipboardy.write(eddsaKeyPair.privateKey.trim())

    const textLines = [
      ``,
      `nexauth generated this production-ready EdDSA key pair for you:`,
      '',
      'Environment variable name:  EDDSA_PRIVATE_KEY',
      'Environment variable value: <copied into your clipboard>',
      '(paste it into your CI environment variable value field)',
      '',
      'Environment variable name:  NEXT_PUBLIC_EDDSA_PUBLIC_KEY',
      'Environment variable value:',
      eddsaKeyPair.publicKey.trim(),
      '',
    ]
    const text = textLines.join('\n')

    // eslint-disable-next-line no-console
    console.log(text)

    ß.warn('NEVER PASTE, SAVE OR SHARE THE EDDSA_PRIVATE_KEY!!!\n')

    process.exit()
  } catch (err) {
    handleError(err, 'commands/generate()', true)
  }
}
