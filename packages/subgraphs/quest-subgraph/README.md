# Quest subgraph

The Gnosis manifest is generated from `config/gnosis.json`. This package uses
Node 26 and The Graph CLI 0.98.1. Install and build it independently of the
legacy application workspace:

```sh
nvm use
npm ci
npm run manifest:gnosis
npm run build
```

To deploy a new version to [Graph Studio](https://thegraph.com/studio/subgraph/quests/),
authenticate with `npx graph auth --studio` and run:

```sh
npm run deploy:studio:gnosis -- --version-label <version>
```

The deployment must finish indexing before it can serve the full historical
dataset. Check `_meta { block { number } hasIndexingErrors }` at the versioned
query endpoint. A Studio deployment does not publish the subgraph to the
decentralized Graph Network; publication is a separate action in Studio.

Quest metadata comes from IPFS file data sources. Its entity is immutable and
may be unavailable until the file is fetched. `questDetailsRef` preserves the
CID on `QuestEntity` while that happens.
