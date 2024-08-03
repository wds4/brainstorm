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
        oProfileBrainstorm.wotScores.degreesOfSeparation = oThisProfile.wotScores.degreesOfSeparation
        oProfileBrainstorm.wotScores.coracle = oThisProfile.wotScores.coracle
      }
      oProfileBrainstorm.lastUpdated = oThisProfile.kind0.oEvent.created_at
      oProfileBrainstorm.brainstorm = true // indicates local info was found in redux store
    }
    if (oThisProfile.wotScores) {
      oProfileBrainstorm.wotScores = JSON.parse(JSON.stringify(oThisProfile.wotScores))
      oProfileBrainstorm.wotScores.degreesOfSeparation = oThisProfile.wotScores.degreesOfSeparation
      oProfileBrainstorm.wotScores.coracle = oThisProfile.wotScores.coracle
    }
    if (oThisProfile.followers) {
      oProfileBrainstorm.followers = JSON.parse(JSON.stringify(oThisProfile.followers))
    }
    if (oThisProfile.mutedBy) {
      oProfileBrainstorm.mutedBy = JSON.parse(JSON.stringify(oThisProfile.mutedBy))
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
  return oProfileBrainstorm
}

// same as above, but takes pubkey as input and converts it to npub
export const getProfileBrainstormFromPubkey = (pubkey, oProfilesByNpub) => {
  const npub = nip19.npubEncode(pubkey)
  return getProfileBrainstormFromNpub(npub, oProfilesByNpub)
}

const returnIntersection = (arr1, arr2) => {
  const aOutput = []
  if (!arr1 || !arr2) {
    return aOutput
  }
  arr1.forEach((elem, item) => {
    if (arr2.includes(elem)) {
      if (!aOutput.includes(elem)) {
        aOutput.push(elem)
      }
    }
  })
  return aOutput
}

// the number of profiles who meet the following two criteria:
// a follow of npub_subject
// a follower of npub_ref
export const returnWoTScore = (npub_subject, npub_ref, oProfilesByNpub) => {
  const aFollowers_ref = getProfileBrainstormFromNpub(npub_ref, oProfilesByNpub).followers
  const aFollows_subject = getProfileBrainstormFromNpub(npub_subject, oProfilesByNpub).follows
  const aIntersection = returnIntersection(aFollowers_ref, aFollows_subject)
  return aIntersection.length
}

export const returnDegreesOfSeparation = (pubkey, oProfilesByNpub, oProfilesByPubkey) => {
  let npub = oProfilesByPubkey[pubkey]
  if (!npub) {
    npub = nip19.npubEncode(pubkey)
  }
  let dosCurrent = 999
  if (oProfilesByNpub[npub] && oProfilesByNpub[npub].wotScores) {
    dosCurrent = oProfilesByNpub[npub].wotScores.degreesOfSeparation
  }
  let dosNew = 999
  const aFollowers = getProfileBrainstormFromNpub(npub, oProfilesByNpub).followers
  aFollowers.forEach((pk, item) => {
    const np = oProfilesByPubkey[pk]
    const aFollows = oProfilesByNpub[np].follows
    if (aFollows.includes(pubkey)) {
      // make sure dosScore is no greater than the current dosScore of np
      const dosFollower = oProfilesByNpub[np].wotScores.degreesOfSeparation
      const dosMinimum = dosFollower + 1
      dosNew = Math.min(dosCurrent, dosMinimum)
    }
  })
  return dosNew
}
