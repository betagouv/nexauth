/* eslint-env node */

import { B } from 'bhala'
import crypto from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

import convertSourceToGlobPatterns from '../helpers/convertSourceToGlobPatterns.js'
import handleError from '../helpers/handleError.js'
import isFile from '../helpers/isFile.js'

import type { KeyPairSyncResult } from 'crypto'

const GITIGNORE_DOTENV_SOURCE = [`# Environment file`, `.env`, ``].join('\n')
const SCOPE = '[nexauth] [cli]'

export default async function init(): Promise<void> {
  try {
    const rootPath = process.cwd()

    const gitignorePath = path.join(rootPath, '.gitignore')
    if (!(await isFile(gitignorePath))) {
      B.warn(`${SCOPE} \`./.gitignore\` file does not exist.`)

      B.info(`${SCOPE} Generating a new \`./.gitignore\` file to ignore nexauth key pair files…`)
      await fs.writeFile(gitignorePath, GITIGNORE_DOTENV_SOURCE, 'utf-8')
    } else {
      const gitignoreSource = await fs.readFile(gitignorePath, 'utf-8')
      const gitignoreGlobPatterns = convertSourceToGlobPatterns(gitignoreSource)

      if (!gitignoreGlobPatterns.includes('.env') && !gitignoreGlobPatterns.includes('/.env')) {
        B.info(`${SCOPE} Updating \`./.gitignore\` file to ignore ".env" file…`)
        await fs.writeFile(gitignorePath, `${gitignoreSource.trim()}\n\n${GITIGNORE_DOTENV_SOURCE}`, 'utf-8')
      }
    }

    const dotEnvPath = path.join(rootPath, '.env')
    if (!(await isFile(dotEnvPath))) {
      B.warn(`${SCOPE} \`./.env\` file does not exist.`)

      B.info(`${SCOPE} Generating a new \`./.env\` file…`)
      await fs.writeFile(dotEnvPath, '', 'utf-8')
    }

    const dotEnvSource = await fs.readFile(dotEnvPath, 'utf-8')
    if (/EDDSA_PRIVATE_KEY=/.test(dotEnvSource) && /NEXT_PUBLIC_EDDSA_PUBLIC_KEY=/.test(dotEnvSource)) {
      return
    }

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

    const privateKeyJwkString = eddsaKeyPair.privateKey.trim().replace(/\n/g, '\\n')
    const publicKeyJwkString = eddsaKeyPair.publicKey.trim().replace(/\n/g, '\\n')
    const dotEnvSourceWithEddsaKeyPair = [
      dotEnvSource.trim(),
      '',
      `##################################################`,
      `# EdDSA Key Pair`,
      `# Don't touch these lines!`,
      `# Those are auto-generated via \`npx nexauth init\`.`,
      '',
      `EDDSA_PRIVATE_KEY="${privateKeyJwkString}"`,
      `NEXT_PUBLIC_EDDSA_PUBLIC_KEY="${publicKeyJwkString}"`,
    ]
      .join('\n')
      .trim()

    B.info(
      `${SCOPE} Updating \`./.env\` file to add generated EDDSA_PRIVATE_KEY & NEXT_PUBLIC_EDDSA_PUBLIC_KEY variables…`,
    )
    await fs.writeFile(dotEnvPath, `${dotEnvSourceWithEddsaKeyPair}\n`, 'utf-8')

    process.exit()
  } catch (err) {
    handleError(err, 'commands/init()', true)
  }
}
