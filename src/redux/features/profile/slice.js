import { createSlice } from '@reduxjs/toolkit'
import { noBannerPicUrl, noProfilePicUrl } from '../../../const'

const initState = {
  signedIn: false,
  signInMethod: 'none', // options: 'none' (equivalent to signedIn false), 'extension', 'secret'
  nsec: '',
  hexKey: '',
  encryptedNsec: '', // not yet in use
  salt: '', // will be used to salt nsec when login by secret key is implemented
  npub: '',
  pubkey: '',
  name: '',
  display_name: '',
  banner: noBannerPicUrl,
  picture: noProfilePicUrl,
  nip05: '',
  about: '',
  website: '',
  kind0: {
    oEvent: {},
  },
  kind3: {
    created_at: 0,
    relays: {},
    follows: [],
  },
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initState,
  reducers: {
    processMyKind3Event: (state, action) => {
      const event = action.payload
      const createdAt = event.created_at
      let myCurrentProfileKind3CreatedAt = 0
      if (state.kind3) {
        myCurrentProfileKind3CreatedAt = state.kind3.created_at
      }
      if (createdAt > myCurrentProfileKind3CreatedAt) {
        // update relays in my profile
        const content = event.content
        const oRelays = JSON.parse(content)
        // update follows in my profile
        let aTags_p = event.tags.filter(([k, v]) => k === 'p' && v && v !== '')
        const aFollows = []
        if (aTags_p) {
          aTags_p.forEach((tag_p, item) => {
            if (tag_p && typeof tag_p == 'object' && tag_p.length > 1) {
              const pk = tag_p[1]
              aFollows.push(pk)
            }
          })
        }
        state.kind3.created_at = createdAt
        state.kind3.relays = oRelays
        state.kind3.follows = aFollows
      }
    },
    updateMyProfile: (state, action) => {
      const oMyProfile = action.payload
      state.display_name = oMyProfile?.displayName
      state.name = oMyProfile?.name
      state.about = oMyProfile?.about
      state.banner = oMyProfile?.banner
      if (oMyProfile?.image) {
        state.picture = oMyProfile?.image
      }
      if (oMyProfile?.picture) {
        state.picture = oMyProfile?.picture
      }
      state.nip05 = oMyProfile?.nip05
    },
    updateSignedIn: (state, action) => {
      state.signedIn = action.payload
    },
    updateSignInMethod: (state, action) => {
      state.signInMethod = action.payload
    },
    updateNsec: (state, action) => {
      state.nsec = action.payload
    },
    updateHexKey: (state, action) => {
      state.hexKey = action.payload
    },
    updateEncryptedNsec: (state, action) => {
      state.encryptedNsec = action.payload
    },
    updateSalt: (state, action) => {
      state.salt = action.payload
    },
    updateNpub: (state, action) => {
      state.npub = action.payload
    },
    updatePubkey: (state, action) => {
      state.pubkey = action.payload
    },
    updateName: (state, action) => {
      state.name = action.payload
    },
    updateDisplayName: (state, action) => {
      state.display_name = action.payload
    },
    updateBanner: (state, action) => {
      state.banner = action.payload
    },
    updatePicture: (state, action) => {
      state.picture = action.payload
    },
    updateNip05: (state, action) => {
      state.nip05 = action.payload
    },
    updateAbout: (state, action) => {
      state.about = action.payload
    },
    updateWebsite: (state, action) => {
      state.website = action.payload
    },
    updateKind0: (state, action) => {
      state.kind0.oEvent = action.payload
    },
    updateKind3CreatedAt: (state, action) => {
      state.kind3.created_at = action.payload
    },
    updateRelays: (state, action) => {
      state.kind3.relays = action.payload
    },
    updateFollows: (state, action) => {
      state.kind3.follows = action.payload
    },
    wipeActiveProfile: (state, action) => {
      state.signedIn = false
      state.signInMethod = 'none'
      state.nsec = ''
      state.hexKey = ''
      state.encryptedNsec = ''
      state.salt = ''
      state.npub = ''
      state.pubkey = ''
      state.name = ''
      state.display_name = ''
      state.banner = noBannerPicUrl
      state.picture = noProfilePicUrl
      state.nip05 = ''
      state.about = ''
      state.website = ''
      state.kind0 = {}
      state.kind0.oEvent = {}
      state.kind3.created_at = 0
      state.kind3.relays = {}
      state.kind3.follows = []
    },
  },
})

export const {
  processMyKind3Event,
  updateMyProfile,
  updateSignedIn,
  updateSignInMethod,
  updateNsec,
  updateHexKey,
  updateEncryptedNsec,
  updateSalt,
  updateNpub,
  updatePubkey,
  updateName,
  updateDisplayName,
  updateBanner,
  updatePicture,
  updateNip05,
  updateAbout,
  updateWebsite,
  updateKind0,
  updateKind3CreatedAt,
  updateRelays,
  updateFollows,
  wipeActiveProfile,
} = profileSlice.actions

export default profileSlice.reducer
