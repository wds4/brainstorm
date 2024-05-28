import { nip19 } from 'nostr-tools'
import { noProfilePicUrl } from '../const'

// same format as content of kind0 note or getProfile from useNDK(),
// except that content uses picture whereas getProfile uses image,
// therefore brainstorm profile object uses both!
// also, additional fields: brainstormDisplayName, wotScores
const oProfileBlank = {
  banner: '',
  lud16: '',
  image: noProfilePicUrl,
  picture: noProfilePicUrl,
  lud06: '',
  website: '',
  about: '',
  name: '',
  display_name: '',
  nip05: '',
  brainstormDisplayName: '',
  follows: [],
  followers: [],
  mutes: [],
  mutedBy: [],
  wotScores: {
    degreesOfSeparation: 99999,
    coracle: 0,
    baselineInfluence: {
      influence: 0,
      averageScore: 0,
      certainty: 0,
      input: 0,
    },
  },
  lastUpdated: 0,
  brainstorm: false,
}

export const getProfileBrainstormFromNpub = (npub, oProfilesByNpub) => {
  let oProfileBrainstorm = oProfileBlank
  if (oProfilesByNpub[npub]) {
    const oThisProfile = JSON.parse(JSON.stringify(oProfilesByNpub[npub]))
    if (
      oThisProfile &&
      oThisProfile.kind0 &&
      oThisProfile.kind0.oEvent &&
      oThisProfile.kind0.oEvent.content
    ) {
      oProfileBrainstorm = JSON.parse(oThisProfile.kind0.oEvent.content)
      if (oProfileBrainstorm?.picture) {
        oProfileBrainstorm.image = oProfileBrainstorm?.picture
      }
      if (oThisProfile.followers) {
        oProfileBrainstorm.follows = oThisProfile.follows
      }
      if (oThisProfile.followers) {
        oProfileBrainstorm.followers = oThisProfile.followers
      }
      if (oThisProfile.mutes) {
        oProfileBrainstorm.mutes = oThisProfile.mutes
      }
      if (oThisProfile.mutedBy) {
        oProfileBrainstorm.mutedBy = oThisProfile.mutedBy
      }
      oProfileBrainstorm.wotScores = {}
      if (oThisProfile.wotScores) {
        oProfileBrainstorm.wotScores = JSON.parse(JSON.stringify(oThisProfile.wotScores))
        oProfileBrainstorm.wotScores.degreesOfSeparation = oThisProfile.wotScores.degreesOfSeparationFromMe
        oProfileBrainstorm.wotScores.coracle = oThisProfile.wotScores.coracle
      }
      oProfileBrainstorm.lastUpdated = oThisProfile.kind0.oEvent.created_at
      oProfileBrainstorm.brainstorm = true // indicates local info was found in redux store
    }
    if (oThisProfile.wotScores) {
      oProfileBrainstorm.wotScores = JSON.parse(JSON.stringify(oThisProfile.wotScores))
      oProfileBrainstorm.wotScores.degreesOfSeparation = oThisProfile.wotScores.degreesOfSeparationFromMe
      oProfileBrainstorm.wotScores.coracle = oThisProfile.wotScores.coracle
    }
  }
  if (!oProfileBrainstorm?.image) {
    oProfileBrainstorm.image = noProfilePicUrl
    oProfileBrainstorm.picture = noProfilePicUrl
  }
  // create brainstormDisplayName
  oProfileBrainstorm.brainstormDisplayName = '...' + npub.slice(-6)
  if (oProfileBrainstorm?.name) {
    oProfileBrainstorm.brainstormDisplayName = '@' + oProfileBrainstorm?.name
  }
  if (oProfileBrainstorm?.display_name) {
    oProfileBrainstorm.brainstormDisplayName = oProfileBrainstorm?.display_name
  }
  // console.log('npub: ' + npub + ' oProfileBrainstorm.wotScores.degreesOfSeparation: '+ oProfileBrainstorm.wotScores.degreesOfSeparation)
  return oProfileBrainstorm
}

// same as above, but takes pubkey as input and converts it to npub
export const getProfileBrainstormFromPubkey = (pubkey, oProfilesByNpub) => {
  const npub = nip19.npubEncode(pubkey)
  return getProfileBrainstormFromNpub(npub, oProfilesByNpub)
  /*
  let oProfileBrainstorm = oProfileBlank
  if (oProfilesByNpub[npub]) {
    oProfileBrainstorm.brainstorm = true // indicates local info was found in redux store
    const oThisProfile = oProfilesByNpub[npub]
    oProfileBrainstorm.wotScores.degreesOfSeparation = oThisProfile.wotScores.degreesOfSeparationFromMe
    if (
      oThisProfile &&
      oThisProfile.kind0 &&
      oThisProfile.kind0.oEvent &&
      oThisProfile.kind0.oEvent.content
    ) {
      oProfileBrainstorm = JSON.parse(oThisProfile.kind0.oEvent.content)
      if (oProfileBrainstorm?.picture) {
        oProfileBrainstorm.image = oProfileBrainstorm?.picture
      }
      oProfileBrainstorm.brainstormDisplayName = '...' + npub.slice(-6)
      if (oProfileBrainstorm?.name) {
        oProfileBrainstorm.brainstormDisplayName = '@' + oProfileBrainstorm?.name
      }
      if (oProfileBrainstorm?.display_name) {
        oProfileBrainstorm.brainstormDisplayName = oProfileBrainstorm?.display_name
      }
      oProfileBrainstorm.wotScores = {}
      oProfileBrainstorm.wotScores.degreesOfSeparation = oThisProfile.wotScores.degreesOfSeparationFromMe
      oProfileBrainstorm.lastUpdated = oThisProfile.kind0.oEvent.created_at
    }
  }
  return oProfileBrainstorm
  */
}
