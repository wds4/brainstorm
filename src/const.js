export const noProfilePicUrl = 'https://nostr.build/i/2282.png'
export const noBannerPicUrl = 'https://nostr.build/i/2282.png'
export const aDefaultRelays = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.wikifreedia.xyz',

  'wss://nostr.wine',
  'wss://nos.lol',
  'wss://purplepag.es',
]
export const cutoffTime = 1714936803 // cutoff time when filtering for tapestry protocol words

/*
'wss://relay.nostr.band',
  'wss://relay.nostr.band',
  'wss://nostr.wine',
  'wss://nos.lol',
  'wss://purplepag.es',
*/

// need to test which listener method makes more sense
export const listenerMethod = 'oneMainListener' // individualListeners versus oneMainListener
