/* eslint-env node */

export default function help() {
  const textLines = [
    ``,
    `nexauth is a simple and safe JWT-based authentication library`,
    `for Next.js framework (https://github.com/betagouv/nexauth).`,
    ``,
    `\x1b[1mUsage\x1b[0m`,
    ``,
    `  $ nexauth [command]`,
    `  $ npx nexauth [command]`,
    `  $ yarn nexauth [command]`,
    ``,
    `\x1b[1mCommands\x1b[0m`,
    ``,
    `            init   Prepare your development environment:`,
    `                   - Git-ignore your local .env file if it's not already ignored`,
    `                   - Inject an EdDSA key pair into your local .env file`,
    `        generate   Generate an EdDSA key pair for your production environment:`,
    `                   - Copy the generated EDDSA_PRIVATE_KEY to your clipboard`,
    `                   - Output the generated NEXT_PUBLIC_EDDSA_PUBLIC_KEY`,
    ``,
  ]
  const text = textLines.join('\n')

  // eslint-disable-next-line no-console
  console.log(text)
}
