## 🌟 Quests

[![Continuous Integration](https://github.com/1Hive/quests/actions/workflows/continuous-integration.yml/badge.svg?branch=main)](https://github.com/1Hive/quests/actions/workflows/continuous-integration.yml)
[![codecov](https://codecov.io/gh/1hive/quests/branch/main/graph/badge.svg?token=IDwI3r7ExZ)](https://codecov.io/gh/1hive/quests)
[![CodeQL](https://github.com/1Hive/quests/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/1Hive/quests/actions/workflows/codeql-analysis.yml)

Quests is a bounty board for 1Hive swarms.

## Setup & Launch

Clone the repository

```sh
git clone git@github.com:1hive/quests
```

Use Node 26 and install the dependencies. The legacy E2E package pins a
Node 16 engine, so the workspace install ignores dependency engine checks.

```sh
nvm use
yarn install --frozen-lockfile --ignore-engines --ignore-scripts
```

Start the project

```sh
# Gnosis Chain
yarn workspace @1hive/quests-react-app start:gnosis
```

The Gnosis Quest subgraph is deployed in [Graph Studio](https://thegraph.com/studio/subgraph/quests/).
For build and deployment steps, see
[the Quest subgraph README](packages/subgraphs/quest-subgraph/README.md).
The application still references hosted Govern and token pair subgraphs, so
those integrations need migration before the complete app can be restored.

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

1. Select xDai chain if **production** or Rinkeby chain if **preview**
2. Click Enable Button account
3. Click on Metamask button

### Code review
- main <- dev <- other branches
- Required reviewer for main <- dev
- [Suggested QA sanity routine](https://hackmd.io/@Gossman/HkLGbAHPc)

### Additional Resources

- [Kanban board](https://app.zenhub.com/workspaces/quests-6092dda4c272a5000e858266/board)
- Discord : 1Hive (Quests Swarm channel)
- [Deployed app](https://quests.1hive.org/)
