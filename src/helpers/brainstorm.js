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
  wotScores: {
    degreesOfSeparation: 99999,
  },
  lastUpdated: 0,
}

export const getProfileBrainstormFromNpub = (npub, oProfilesByNpub) => {
  let oProfileBrainstorm = oProfileBlank
  if (oProfilesByNpub[npub]) {
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
  if (!oProfilesByNpub[npub]) {
    oProfileBrainstorm.wotScores.degreesOfSeparation = 99
  }
  return oProfileBrainstorm
}

// same as above, but takes pubkey as input and converts it to npub
export const getProfileBrainstormFromPubkey = (pubkey, oProfilesByNpub) => {
  const npub = nip19.npubEncode(pubkey)
  let oProfileBrainstorm = oProfileBlank
  if (oProfilesByNpub[npub]) {
    const oThisProfile = oProfilesByNpub[npub]
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
}
