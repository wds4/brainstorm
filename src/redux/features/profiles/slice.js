import { createSlice } from '@reduxjs/toolkit'
import { noBannerPicUrl, noProfilePicUrl } from '../../../const'
import { nip19 } from 'nostr-tools'

/*
oProfiles: {
  byPubkey: {
    <pubkey>: npub, // use pubkey to find the npub, then use byNpub to look up data
  },
  byNpub: {
    <npub>: {
      kind0: {
        oEvent: <oKind0Event>,
      },
      kind3: {
        oEvent: <oKind0Event>,
      },
      pubkey: '',
      followers: [],
      wotScores: {
        degreeOfSeparationFromMe: 999,
      },
    }
  },

}
*/

/*
kind0: profile info
kind3: follows and relays info
*/

const oDefaultByNpubData = {
  kind0: {},
  kind3: {},
  pubkey: '', // include npub here so no need to use nip19 every time you need to find the npub from the pubkey
  followers: [], // array of pubkeys
  wotScores: {
    degreesOfSeparationFromMe: 999,
  },
}

const initState = {
  oProfiles: {
    byPubkey: {},
    byNpub: {},
  },
}

export const profilesSlice = createSlice({
  name: 'profiles',
  initialState: initState,
  reducers: {
    updateKind0Event: (state, action) => {
      const oKind0Event = action.payload
      const pubkey = oKind0Event.pubkey
      const npub = nip19.npubEncode(pubkey)
      if (!state.oProfiles.byNpub[npub]) {
        state.oProfiles.byNpub[npub] = JSON.parse(JSON.stringify(oDefaultByNpubData))
      }
      if (!state.oProfiles.byNpub[npub].pubkey) {
        state.oProfiles.byNpub[npub].pubkey = pubkey
      }
      if (!state.oProfiles.byNpub[npub].kind0.oEvent) {
        state.oProfiles.byNpub[npub].kind0.oEvent = oKind0Event
      }
      if (state.oProfiles.byNpub[npub].kind0.oEvent.created_at < oKind0Event.created_at) {
        state.oProfiles.byNpub[npub].kind0.oEvent = oKind0Event
      }
    },
    updateKind3Event: (state, action) => {
      const oKind3Event = action.payload
      const pubkey = oKind3Event.pubkey
      const npub = nip19.npubEncode(pubkey)
      if (!state.oProfiles.byPubkey[pubkey]) {
        state.oProfiles.byPubkey[pubkey] = npub
      }
      if (!state.oProfiles.byNpub[npub]) {
        state.oProfiles.byNpub[npub] = JSON.parse(JSON.stringify(oDefaultByNpubData))
      }
      if (!state.oProfiles.byNpub[npub].pubkey) {
        state.oProfiles.byNpub[npub].pubkey = pubkey
      }
      if (!state.oProfiles.byNpub[npub].kind3.oEvent) {
        state.oProfiles.byNpub[npub].kind3.oEvent = oKind3Event
      }
      if (state.oProfiles.byNpub[npub].kind3.oEvent.created_at < oKind3Event.created_at) {
        state.oProfiles.byNpub[npub].kind3.oEvent = oKind3Event
      }
    },
    // same as updateKind3Event, but also initialize pubkeys from the following list
    processKind3Event: (state, action) => {
      const oKind3Event = action.payload
      const pubkey = oKind3Event.pubkey
      const npub = nip19.npubEncode(pubkey)
      // Presumably this profile is already in the database, otherwise we would not have searched for its kind3 event.
      // But just in case it's not, add it:
      if (!state.oProfiles.byPubkey[pubkey]) {
        state.oProfiles.byPubkey[pubkey] = npub
      }
      if (!state.oProfiles.byNpub[npub]) {
        state.oProfiles.byNpub[npub] = JSON.parse(JSON.stringify(oDefaultByNpubData))
      }
      if (!state.oProfiles.byNpub[npub].pubkey) {
        state.oProfiles.byNpub[npub].pubkey = pubkey
      }
      if (!state.oProfiles.byNpub[npub].kind3.oEvent) {
        state.oProfiles.byNpub[npub].kind3.oEvent = oKind3Event
      }
      if (state.oProfiles.byNpub[npub].kind3.oEvent.created_at < oKind3Event.created_at) {
        state.oProfiles.byNpub[npub].kind3.oEvent = oKind3Event
      }
      // Fetch the degrees of separation of the author npub, authorDoS.
      const authorDoS = Number(state.oProfiles.byNpub[npub].wotScores.degreesOfSeparationFromMe)
      const minDoS = authorDoS + 1
      // now process each pubkey from the follows list
      const aTags_p = oKind3Event.tags.filter(([k, v]) => k === 'p' && v && v !== '')
      aTags_p.forEach((tag_p, item) => {
        if (tag_p && typeof tag_p == 'object' && tag_p.length > 1) {
          const pk = tag_p[1]
          const np = nip19.npubEncode(pk)
          // Any preexisting npub must have MINIMUM degree of separation of minDoS (or might already be lower)
          if (state.oProfiles.byNpub[np]) {
            const currentDoS = Number(
              state.oProfiles.byNpub[np].wotScores.degreesOfSeparationFromMe,
            )
            state.oProfiles.byNpub[np].wotScores.degreesOfSeparationFromMe = Math.min(
              minDoS,
              currentDoS,
            )
          }
          // Any newly added npub must have a degrees of separation minDoS = authorDoS + 1.
          if (!state.oProfiles.byNpub[np]) {
            state.oProfiles.byNpub[np] = JSON.parse(JSON.stringify(oDefaultByNpubData))
            state.oProfiles.byNpub[np].wotScores.degreesOfSeparationFromMe = minDoS
          }
          // instantiate byPubkey if not already done
          if (!state.oProfiles.byPubkey[pk]) {
            state.oProfiles.byPubkey[pk] = np
          }
          // update state.oProfiles.byNpub[np].followers
          if (!state.oProfiles.byNpub[np].followers.includes(pubkey)) {
            state.oProfiles.byNpub[np].followers.push(pubkey)

          }
        }
      })
    },
    updateDegreesOfSeparationFromMe: (state, action) => {
      const { npub_toUpdate, degreesOfSeparationFromMe_new } = action.payload
      // console.log('updateDegreesOfSeparationFromMe; npub_toUpdate: ' + npub_toUpdate + '; degreesOfSeparationFromMe_new: ' + degreesOfSeparationFromMe_new)
      if (!state.oProfiles.byNpub[npub_toUpdate]) {
        state.oProfiles.byNpub[npub_toUpdate] = JSON.parse(JSON.stringify(oDefaultByNpubData))
      }
      state.oProfiles.byNpub[npub_toUpdate].wotScores.degreesOfSeparationFromMe =
        degreesOfSeparationFromMe_new
      // console.log('updateDegreesOfSeparationFromMe; npub_toUpdate DONE: ' + npub_toUpdate + '; degreesOfSeparationFromMe_new: ' + degreesOfSeparationFromMe_new)
    },
    wipeProfiles: (state, action) => {
      state.oProfiles = {}
      state.oProfiles.byPubkey = {}
      state.oProfiles.byNpub = {}
    },
  },
})

export const {
  updateKind0Event,
  updateKind3Event,
  processKind3Event,
  updateDegreesOfSeparationFromMe,
  wipeProfiles,
} = profilesSlice.actions

export default profilesSlice.reducer
