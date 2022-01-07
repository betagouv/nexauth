#!/bin/bash

# Exit when any command fails:
set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

cd ./examples/with-prisma

printf "${BLUE}Installing E2E Test App dependencies for E2E Test App…${NC}\n"
yarn

printf "${BLUE}Removing old nexauth dependency files in E2E Test App…${NC}\n"
rm -Rf ./node_modules/nexauth

printf "${BLUE}Copying nexauth dependency files in E2E Test App…${NC}\n"
mkdir -p ./node_modules/nexauth/dist
cp -R ../../dist ./node_modules/nexauth
cp ../../package.json ./node_modules/nexauth/package.json
cp ../../LICENSE ./node_modules/nexauth/LICENSE
cp ../../README.md ./node_modules/nexauth/README.md

printf "${BLUE}Preparing environment variables for E2E Test App…${NC}\n"
cp ./.env.sample ./.env

if [ -z "$CI" ]; then
  # We only need the PostreSQL Docker container outside of Github Actions environment
  # since we rather use its service container when within (c.f. `.github/workflows/check.yml`)
  printf "${BLUE}Starting E2E Test App PostreSQL Docker container…${NC}\n"
  docker-compose down
  docker-compose up -d db
  # https://stackoverflow.com/a/63011266/2736233
  timeout 90s bash -c "until docker exec nexauth_test_db pg_isready ; do sleep 1 ; done"
  printf "${GREEN}✔ E2E Test App PostreSQL Docker container ready to accept connections.${NC}\n"
else
  printf "${BLUE}Building E2E Test App…${NC}\n"
  yarn build
fi

printf "${BLUE}Deploying database migrations for E2E Test App…${NC}\n"
yarn prisma migrate deploy

printf "${BLUE}Generating EdDSA key pair for E2E Test App…${NC}\n"
rm -f ./.gitignore
cp ./node_modules/nexauth/dist/commands/index.js ./node_modules/nexauth/dist/commands/index.mjs
node ./node_modules/nexauth/dist/commands/index.mjs init

cd ../..
