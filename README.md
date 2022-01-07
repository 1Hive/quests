## 🌟 Quests

[![Continuous Integration](https://github.com/1Hive/quests/actions/workflows/continuous-integration.yml/badge.svg?branch=main)](https://github.com/1Hive/quests/actions/workflows/continuous-integration.yml)
[![codecov](https://codecov.io/gh/1hive/quests/branch/main/graph/badge.svg?token=IDwI3r7ExZ)](https://codecov.io/gh/1hive/quests)
[![CodeQL](https://github.com/1Hive/quests/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/1Hive/quests/actions/workflows/codeql-analysis.yml)

### STAGE : _MVP_

Quests is a bounty board for 1Hive swarms.

## Setup & Launch

Clone the repository

```sh
git clone git@github.com:1hive/quests
```

Install the dependencies

```sh
yarn
```

Start the project

```sh
# Rinkeby testnet
yarn start
# Local chain (not working for the moment, missing the local subgraph)
> yarn start:local
> yarn chain
> yarn deploy:local
```

### Docs

#### Anonymous features

- Browse quests
- Filter Quests

#### Account connected features

- Play quest
- Create quest
- Fund quest
- Challenge quest

#### Connect

1. Select xDai chain if realease or Rinkeby chain if debug
2. Click Enable Button account
3. Click on Metamask button

### Additional Resources

- [Kanban board](https://app.zenhub.com/workspaces/quests-6092dda4c272a5000e858266/board)
- Discord : 1Hive (Quest Swarm channel)
- [Deployed app](https://quests.vercel.app/)
