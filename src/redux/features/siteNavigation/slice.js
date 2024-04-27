import { createSlice } from '@reduxjs/toolkit'

export const siteNavigationSlice = createSlice({
  name: 'siteNavigation',
  initialState: {
    app: 'tapestry', // home, conceptGraph, grapevine, curatedLists, wikifreedia, twittr
    npub: null,
  },
  reducers: {
    updateApp: (state, action) => {
      state.app = action.payload
    },
    updateNpub: (state, action) => {
      state.npub = action.payload
    },
  },
})

export const { updateApp, updateNpub } = siteNavigationSlice.actions

export default siteNavigationSlice.reducer
