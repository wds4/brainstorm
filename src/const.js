export const noProfilePicUrl = 'https://nostr.build/i/2282.png'
export const noBannerPicUrl = 'https://nostr.build/i/2282.png'
export const aDefaultRelays = [
  'wss://relay.wikifreedia.xyz',
  'wss://purplepag.es',
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.nostr.band',
  'wss://relay.nostr.band',
  'wss://nostr.wine',
  'wss://nos.lol',
]
export const cutoffTime = 1714936803 // cutoff time when filtering for tapestry protocol words

/*
  'wss://relay.wikifreedia.xyz',
  'wss://purplepag.es',
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.nostr.band',
  'wss://relay.nostr.band',
  'wss://nostr.wine',
  'wss://nos.lol',

*/

// need to test which listener method makes more sense
export const listenerMethod = 'oneMainListener' // individualListeners versus oneMainListener versus off
// moving this variable to settings

// grapevine defaults
export const defAttFac = 80 // 0 is most strict; 100 is most permissive
export const defRigor = 25 // 0 is most lax; 100 is most strict
export const defDunbarNumber = 100

export const defDefScore = 0
export const defDefCon = 0

export const defFollInterpScore = 100
export const defFollInterpCon = 5

export const defMuteInterpScore = 0
export const defMuteInterpCon = 10

// kinds 0, 3, 10000
export const defListener1 = 'show' // my profile
export const defListener2 = 'hide' // profiles of me and my follows
export const defListener3 = 'show' // the profile being viewed
export const defListener4 = 'hide' // all profiles
export const defListener5 = 'hide' // nostrapedia authors
// other kinds
export const defListener6 = 'show' // nostrapedia content (kind 30818)
export const defListener7 = 'show' // concept graph content (kinds 9902, 39902)
export const defListener8 = 'hide' //
export const defListener9 = 'hide' //
export const defListener10 = 'hide' //
