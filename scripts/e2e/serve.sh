#!/bin/bash

# Exit when any command fails:
set -e

BLUE='\033[0;34m'
NC='\033[0m' # No Color

printf "${BLUE}Serving test applicationâ€¦${NC}\n"
cd ./examples/with-prisma
yarn start &
