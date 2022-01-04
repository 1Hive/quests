#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Court known addresses
court_staging=
court_rinkeby=0x949f75Ab8362B4e53967742dC93CC289eFb43f6D
court_xdai=0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85
court_polygon=0xf0C8376065fadfACB706caFbaaC96B321069C015

# Known block numbers
start_block_staging=
start_block_rinkeby=8250225
start_block_xdai=14861364
start_block_polygon=21936374

# Validate network
networks=(rpc staging rinkeby xdai polygon)
if [[ -z $NETWORK || ! " ${networks[@]} " =~ " ${NETWORK} " ]]; then
  echo 'Please make sure the network provided is either rpc, staging, rinkeby, xdai or polygon'
  exit 1
fi

# Use mainnet network in case of local deployment
if [[ "$NETWORK" = "rpc" ]]; then
  ENV='mainnet'
elif [[ "$NETWORK" = "staging" ]]; then
  ENV='rinkeby'
elif [[ "$NETWORK" = "polygon" ]]; then
  ENV='matic'
else
  ENV=${NETWORK}
fi

# Load start block
if [[ -z $START_BLOCK ]]; then
  START_BLOCK_VAR=start_block_$NETWORK
  START_BLOCK=${!START_BLOCK_VAR}
fi
if [[ -z $START_BLOCK ]]; then
  START_BLOCK=0
fi

# Try loading Court address if missing
if [[ -z $COURT ]]; then
  COURT_VAR=court_$NETWORK
  COURT=${!COURT_VAR}
fi

# Validate court address
if [[ -z $COURT ]]; then
  echo 'Please make sure a Court address is provided'
  exit 1
fi

# Remove previous subgraph if there is any
if [ -f subgraph.yaml ]; then
  echo 'Removing previous subgraph manifest...'
  rm subgraph.yaml
fi

# Build subgraph manifest for requested variables
echo "Preparing new subgraph for Court address ${COURT} to network ${NETWORK}"
cp subgraph.template.yaml subgraph.yaml
sed -i -e "s/{{network}}/${ENV}/g" subgraph.yaml
sed -i -e "s/{{court}}/${COURT}/g" subgraph.yaml
sed -i -e "s/{{startBlock}}/${START_BLOCK}/g" subgraph.yaml
rm -f subgraph.yaml-e

# Parse blacklisted modules
echo "Setting blacklisted modules"
node ./scripts/parse-blacklisted-modules.js "$NETWORK"