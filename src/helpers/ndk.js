import NDK from '@nostr-dev-kit/ndk'
import { aDefaultRelays } from '../const'
// import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie'

// define the relays to publish and read from
// const defaultRelays = ['wss://relay.damus.io', 'wss://relay.primal.net']
// const defaultRelays = ['wss://relay.damus.io']

const defaultRelays = [
  'wss://purplepag.es',
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.nostr.band',
  'wss://nostr.wine',
  'wss://nos.lol',
  'wss://relay.tapestry.ninja',
  'wss://relay.wikifreedia.xyz',
]
// const dexieAdapter = new NDKCacheAdapterDexie({ dbName: 'your-db-name' })
// create a new NDK instance
// const ndk = new NDK({ cacheAdapter: dexieAdapter, explicitRelayUrls: defaultRelays })
const ndk = new NDK({ explicitRelayUrls: defaultRelays })

// connect to the relays
ndk
  .connect()
  .then(() => console.log('ndk connected'))
  .catch((err) => console.error(err))

export { ndk }
