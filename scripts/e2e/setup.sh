#!/bin/bash

# Exit when any command fails:
set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

printf "${BLUE}Removing old nexauth files within E2E workspace…${NC}\n"
rm -Rf ./e2e/with-prisma/nexauth/dist
rm -f ./e2e/with-prisma/nexauth/package.json
# TODO Solve this dirty ESM types declaration workaround.
rm -f ./e2e/with-prisma/nexauth/AuthProvider.d.ts

printf "${BLUE}Copying nexauth package file within E2E workspace…${NC}\n"
cp -R ./dist ./e2e/with-prisma/nexauth/dist
cp ./package.json ./e2e/with-prisma/nexauth/package.json
cp ./LICENSE ./e2e/with-prisma/nexauth/LICENSE
cp ./README.md ./e2e/with-prisma/nexauth/README.md
# TODO Solve this dirty ESM types declaration workaround.
cp ./AuthProvider.d.ts ./e2e/with-prisma/nexauth/AuthProvider.d.ts

cd ./e2e/with-prisma

printf "${BLUE}Installing dependencies within E2E workspace…${NC}\n"
yarn

printf "${BLUE}Building test app within E2E workspace…${NC}\n"
cp ./.env.sample ./.env
yarn build

# We only need a PostreSQL Docker container outside of Github Actions environment
# since we rather use its service container when within (c.f. `.github/workflows/check.yml`)
if [ -z "$CI" ]; then
  printf "${BLUE}Starting PostreSQL Docker container…${NC}\n"
  docker-compose up -d db
  # https://stackoverflow.com/a/63011266/2736233
  timeout 90s bash -c "until docker exec nexauth_test_db pg_isready ; do sleep 1 ; done"
  printf "${GREEN}✔ PostreSQL Docker container ready to accept connection.${NC}\n"
fi

printf "${BLUE}Deploying database migrations…${NC}\n"
yarn prisma migrate deploy

cd ../..
