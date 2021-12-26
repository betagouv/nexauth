/* eslint-env node */

import ß from 'bhala'
import crypto from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

import convertSourceToGlobPatterns from '../helpers/convertSourceToGlobPatterns'
import handleError from '../helpers/handleError'
import isDirectory from '../helpers/isDirectory'
import isFile from '../helpers/isFile'

const GITIGNORE_NEXAUTH_SOURCE = [`# nexauth Key Pair`, `nexauth.public.json`, `.nexauth.private.json`, ``].join('\n')
const SCOPE = '[nexauth] [scripts/writeKeyPairFiles.js]'

async function writeKeyPairFiles(): Promise<void> {
  try {
    const rootPath = process.cwd()

    const gitignorePath = path.join(rootPath, '.gitignore')
    if (!(await isFile(gitignorePath))) {
      ß.warn(`${SCOPE} \`./.gitignore\` file does not exist.`)

      ß.info(`${SCOPE} Generating a new \`./.gitignore\` file to ignore nexauth key pair files…`)
      await fs.writeFile(gitignorePath, GITIGNORE_NEXAUTH_SOURCE, 'utf-8')
    } else {
      const gitignoreSource = await fs.readFile(gitignorePath, 'utf-8')
      const gitignoreGlobPatterns = convertSourceToGlobPatterns(gitignoreSource)

      if (
        !gitignoreGlobPatterns.includes('.nexauth.private.json') ||
        !gitignoreGlobPatterns.includes('nexauth.public.json')
      ) {
        ß.info(`${SCOPE} Updating \`./.gitignore\` file to ignore nexauth key pair files…`)
        await fs.writeFile(gitignorePath, `${gitignoreSource}\n${GITIGNORE_NEXAUTH_SOURCE}`, 'utf-8')
      }
    }

    const nextPublicDirectoryPath = path.join(rootPath, 'public')
    const privateKeyFilePath = path.join(rootPath, '.nexauth.private.json')
    const publicKeyFilePath = path.join(nextPublicDirectoryPath, 'nexauth.public.json')
    if ((await isFile(privateKeyFilePath)) || (await isFile(publicKeyFilePath))) {
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

    const privateKeyFileSource = JSON.stringify(keypair.privateKey, null, 2)
    ß.info(`${SCOPE} Generating \`./.nexauth.private.json\` file…`)
    await fs.writeFile(privateKeyFilePath, privateKeyFileSource, 'utf-8')

    // This can't be anything else than "./public"
    // https://nextjs.org/docs/basic-features/static-file-serving
    if (!(await isDirectory(nextPublicDirectoryPath))) {
      ß.warn(`${SCOPE} \`./public\` directory does not exist.`)

      ß.info(`${SCOPE} Generating an empty \`./public\` directory to store nexauth public key…`)
      await fs.mkdir(nextPublicDirectoryPath)
    }
    const publicKeyFileSource = JSON.stringify(keypair.publicKey, null, 2)
    ß.info(`${SCOPE} Generating \`./public/nexauth.public.json\` file…`)
    await fs.writeFile(publicKeyFilePath, publicKeyFileSource, 'utf-8')
  } catch (err) {
    handleError(err, 'scripts/writeKeyPairFiles.js', true)
  }
}

writeKeyPairFiles()
