import { createSlice } from '@reduxjs/toolkit'
import { noBannerPicUrl, noProfilePicUrl } from '../../../const'

const initState = {
  signedIn: false,
  signInMethod: 'none', // options: 'none' (equivalent to signedIn false), 'extension', 'secret'
  nsec: '',
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
    updateSignedIn: (state, action) => {
      state.signedIn = action.payload
    },
    updateSignInMethod: (state, action) => {
      state.signInMethod = action.payload
    },
    updateNsec: (state, action) => {
      state.nsec = action.payload
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
      state.kind3.created_at = 0
      state.kind3.relays = {}
      state.kind3.follows = []
    },
  },
})

export const {
  updateSignedIn,
  updateSignInMethod,
  updateNsec,
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
  updateKind3CreatedAt,
  updateRelays,
  updateFollows,
  wipeActiveProfile,
} = profileSlice.actions

export default profileSlice.reducer
