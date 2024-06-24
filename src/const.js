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
export const defListener1 = 'show' // my profile (STEP 1)
export const defListener2 = 'hide' // profiles of me and my follows (STEP 2)
export const defListener3 = 'show' // the profile being viewed
export const defListener4 = 'hide' // all profiles (STEP 4)
export const defListener5 = 'hide' // nostrapedia authors (STEP 3)
// other kinds
export const defListener6 = 'show' // nostrapedia content (kind 30818)
export const defListener7 = 'show' // concept graph content (kinds 9902, 39902)
export const defListener8 = 'hide' //
export const defListener9 = 'hide' //
export const defListener10 = 'hide' //

export const aGoodReactions = ['+', '👍', '💯', '💜', '🧡', '👀', '🤙', '🚀', '🫂', '🔥', '🙏🏼', '♥️', '❤️‍🔥']
export const aBadReactions = ['-', '👎']

// Content Discovery defaults
export const defContDiscRigor = 60 // able to be more rigorous than baseline grapevine given higher interpreted confidence of contextual endorsements

// Interpretation of Contextual Endorsements
export const defFireInterpScore = 500 // for score == '🔥', pseudo NIP-77
export const defThumbUpInterpScore = 200 // for score == '👍', pseudo NIP-77
export const defThumbDownInterpScore = 0 // for score == '👎', pseudo NIP-77
export const defContextualEndorsementInterpCon = 35

// Interpretation of likes / dislikes of wiki articles
export const defContextualWikiDislikeInterpScore = 0
export const defContextualWikiDislikeInterpCon = 20
export const defContextualWikiLikeInterpScore = 200
export const defContextualWikiLikeInterpCon = 20
