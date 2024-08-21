import NDK from '@nostr-dev-kit/ndk'
import { aDefaultRelays, defaultRelaysNostrHooks } from '../const'

import { Buffer } from 'buffer'
window.Buffer = Buffer

// import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie'

/*
// moving this to const and changing name to defaultRelaysNostrHooks
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
  */
// const dexieAdapter = new NDKCacheAdapterDexie({ dbName: 'your-db-name' })
// create a new NDK instance
// const ndk = new NDK({ cacheAdapter: dexieAdapter, explicitRelayUrls: defaultRelaysNostrHooks })
/*
const sigWorker = import.meta.env.DEV
  ? new Worker(new URL('@nostr-dev-kit/ndk/workers/sig-verification?worker', import.meta.url), {
      type: 'module',
    })
  : new NDKSigVerificationWorker()
const ndk = new NDK({ explicitRelayUrls: defaultRelaysNostrHooks })
ndk.signatureVerificationWorker = sigWorker
*/

const ndk = new NDK({ explicitRelayUrls: defaultRelaysNostrHooks })

// connect to the relays
ndk
  .connect()
  .then(() => console.log('ndk connected'))
  .catch((err) => console.error(err))

export { ndk }

const tapestryRelay = ['wss://relay.tapestry.ninja']

const ndk_brainstorm = new NDK({ explicitRelayUrls: tapestryRelay })

// connect to the relays
ndk_brainstorm
  .connect()
  .then(() => console.log('ndk_brainstorm connected'))
  .catch((err) => console.error(err))

export { ndk_brainstorm }
