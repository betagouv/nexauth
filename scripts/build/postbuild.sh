#!/bin/bash

# Exit when any command fails:
set -e

# Despite following Typescript recommandations for full ESM support:
# https://www.typescriptlang.org/docs/handbook/esm-node.html
# Typescript doesn't seem to be able to take into account `exports.types` in `package.json` file.
# TODO Solve this dirty ESM types declaration workaround.
cp ./dist/AuthProvider/index.d.ts ./AuthProvider.d.ts
cp ./dist/libs/privateJwt.d.ts ./privateJwt.d.ts
cp ./dist/libs/publicJwt.d.ts ./publicJwt.d.ts
