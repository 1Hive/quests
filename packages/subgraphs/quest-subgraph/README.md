# Quests subgraph (Gnosis)

This package builds the Quests subgraph for Gnosis with Node.js 26 LTS.
It is installed independently from the legacy Yarn monorepo.

```sh
cd packages/subgraphs/quest-subgraph
nvm use
npm ci
npm run manifest:gnosis
npm run build
```

The Gnosis manifest uses the current `gnosis` network identifier. The
`goerli` configuration remains for historical reference; Goerli and the
hosted-service deployment scripts are retired.

## Deploy to Subgraph Studio

Create a Gnosis subgraph in [Subgraph Studio](https://thegraph.com/studio/)
and obtain its slug and deploy key. Then run:

```sh
graph auth <DEPLOY_KEY>
GRAPH_STUDIO_SLUG=<YOUR_STUDIO_SLUG> npm run deploy:studio:gnosis
```

The deploy script generates the Gnosis manifest, builds it, and uploads it to
Studio. A Studio deployment is for testing; publishing to The Graph Network
is a separate on-chain action. Verify indexing to the chain head and query
results in Studio before publishing. Update the app's hosted-service URLs
in `packages/react-app/src/networks.ts` to the new Graph gateway endpoint
and API key after publishing.

## Network compatibility

The mappings still read quest details with `ipfs.cat` during Ethereum event
handlers. The Graph's feature matrix marks this as experimental and without
indexing arbitration. Before relying on the decentralized network, migrate
the metadata to IPFS file data sources. That requires a separate metadata
entity and changes to app queries because file handlers cannot update
chain-based entities. The repository's build does not prove that historical
IPFS files are available or that the subgraph can index to the chain head.
