# Contributing

- [Get Started](#get-started)
  - [Requirements](#requirements)
  - [Setup](#setup)
- [IDEs](#ides)
  - [Visual Studio Code](#visual-studio-code)

## Get Started

### Requirements

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://www.docker.com/get-started)

### Setup

> ⚠️ **Important**  
> If you're under **Windows**, please run all the CLI commands within a Linux shell-like terminal (i.e.: Git Bash).

Then run:

```sh
git clone https://github.com/betagouv/nexauth.git
cd nexauth
yarn
yarn setup
```

## IDEs

### Visual Studio Code

`.vscode/settings.json`

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "eslint.codeActionsOnSave.mode": "all",
  "eslint.format.enable": true,
  "eslint.packageManager": "yarn",
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```
