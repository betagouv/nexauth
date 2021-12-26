import ß from 'bhala'
import crypto from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

import convertSourceToGlobPatterns from '../helpers/convertSourceToGlobPatterns'
import handleError from '../helpers/handleError'
import isFile from '../helpers/isFile'

const GITIGNORE_DOTENV_SOURCE = [`# Environment file`, `.env`, ``].join('\n')
const SCOPE = '[nexauth] [cli]'

export default async function init(): Promise<void> {
  try {
    const rootPath = process.cwd()

    const gitignorePath = path.join(rootPath, '.gitignore')
    if (!(await isFile(gitignorePath))) {
      ß.warn(`${SCOPE} \`./.gitignore\` file does not exist.`)

      ß.info(`${SCOPE} Generating a new \`./.gitignore\` file to ignore nexauth key pair files…`)
      await fs.writeFile(gitignorePath, GITIGNORE_DOTENV_SOURCE, 'utf-8')
    } else {
      const gitignoreSource = await fs.readFile(gitignorePath, 'utf-8')
      const gitignoreGlobPatterns = convertSourceToGlobPatterns(gitignoreSource)

      if (!gitignoreGlobPatterns.includes('.env') && !gitignoreGlobPatterns.includes('/.env')) {
        ß.info(`${SCOPE} Updating \`./.gitignore\` file to ignore ".env" file…`)
        await fs.writeFile(gitignorePath, `${gitignoreSource.trim()}\n\n${GITIGNORE_DOTENV_SOURCE}`, 'utf-8')
      }
    }

    const dotEnvPath = path.join(rootPath, '.env')
    if (!(await isFile(dotEnvPath))) {
      ß.warn(`${SCOPE} \`./.env\` file does not exist.`)

      ß.info(`${SCOPE} Generating a new \`./.env\` file…`)
      await fs.writeFile(dotEnvPath, '', 'utf-8')
    }

    const dotEnvSource = await fs.readFile(dotEnvPath, 'utf-8')
    if (/RSA_PRIVATE_KEY=/.test(dotEnvSource) && /NEXT_PUBLIC_RSA_PUBLIC_KEY=/.test(dotEnvSource)) {
      return
    }

    // https://nodejs.org/api/crypto.html#cryptogeneratekeypairtype-options-callback
    // > It is recommended to encode public keys as 'spki'
    // > and private keys as 'pkcs8' with encryption for long-term storage
    const keypair = crypto.generateKeyPairSync('ed448', {
      modulusLength: 4096,
      privateKeyEncoding: {
        format: 'jwk',
        type: 'pkcs8',
      },
      publicKeyEncoding: {
        format: 'jwk',
        type: 'spki',
      },
    })

    const privateKeyJwkString = JSON.stringify(keypair.privateKey)
    const publicKeyJwkString = JSON.stringify(keypair.publicKey)
    const dotEnvSourceWithRsaKeyPair = [
      dotEnvSource.trim(),
      '',
      `##################################################`,
      `# RSA Key Pair`,
      `# ⚠️ Don't add or change anything below these lines.`,
      `# 🖥️ Run \`npx nexauth\` to generate them.`,
      '',
      `RSA_PRIVATE_KEY="${privateKeyJwkString}"`,
      `NEXT_PUBLIC_RSA_PUBLIC_KEY="${publicKeyJwkString}"`,
    ]
      .join('\n')
      .trim()

    ß.info(`${SCOPE} Updating \`./.env\` file to add generated RSA_PRIVATE_KEY & NEXT_PUBLIC_RSA_PUBLIC_KEY variables…`)
    await fs.writeFile(dotEnvPath, `${dotEnvSourceWithRsaKeyPair}\n`, 'utf-8')

    process.exit()
  } catch (err) {
    handleError(err, 'commands/init()', true)
  }
}
