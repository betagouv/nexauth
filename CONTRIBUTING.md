# Contributing

- [Get Started](#get-started)
  - [Requirements](#requirements)
  - [Setup](#setup)
- [Test](#test)
  - [Unit](#unit)
    - [Watch unit tests](#watch-unit-tests)
  - [E2E](#e2e)
    - [Setup E2E tests](#setup-e2e-tests)
    - [Run E2E tests](#run-e2e-tests)
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

## Test

### Unit

```sh
yarn test:unit
```

#### Watch unit tests

```sh
yarn test:unit:watch
```

### E2E

#### Setup E2E tests

To install Playwright headless browsers, run:

```sh
yarn playwright install
```

> ⚠️ **Important**  
> If you're under **Windows**, run this command under a Powershell terminal if you get any EPERM error.

#### Run E2E tests

To (re-)generate the test app (within `./e2e/with-prima` directory), run

```sh
yarn test:e2e:setup
```

To serve the test app, run (in another CLI tab):

```sh
cd ./e2e/with-prima
yarn dev
```

To run the E2E test on the served test app, run:

```sh
yarn test:e2e
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
