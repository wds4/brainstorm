import { createSlice } from '@reduxjs/toolkit'

export const siteNavigationSlice = createSlice({
  name: 'siteNavigation',
  initialState: {
    app: 'tapestry', // home, conceptGraph, grapevine, curatedLists, wikifreedia, twittr
    npub: '', // which npub is being viewed on the profile page
    viewContextId: '', // which context is being viewed on the view single context page; is either an event id (if kind 9902) or an naddr (if kind 39902)
  },
  reducers: {
    updateApp: (state, action) => {
      state.app = action.payload
    },
    updateNpub: (state, action) => {
      state.npub = action.payload
    },
    updateViewContextId: (state, action) => {
      state.viewContextId = action.payload
    },
  },
})

export const { updateApp, updateNpub, updateViewContextId } = siteNavigationSlice.actions

export default siteNavigationSlice.reducer
