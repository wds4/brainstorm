import { createSlice } from '@reduxjs/toolkit'

export const siteNavigationSlice = createSlice({
  name: 'siteNavigation',
  initialState: {
    app: 'home', // home, conceptGraph, grapevine, curatedLists, wikifreedia, twittr
    npub: '', // which npub is being viewed on the profile page
    viewContextId: '', // which context is being viewed on the view single context page; is either an event id (if kind 9902) or an naddr (if kind 39902)
    conceptGraph: {
      viewWord: '', // cid of the word being viewed
      viewWordType: '',
      viewRelationshipType: '',
      viewConceptGraph: '',
      viewConcept: '',
    },
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
    updateViewWord: (state, action) => {
      state.conceptGraph.viewWord = action.payload
    },
    updateViewWordType: (state, action) => {
      state.conceptGraph.viewWordType = action.payload
    },
    updateViewRelationshipType: (state, action) => {
      state.conceptGraph.viewRelationshipType = action.payload
    },
  },
})

export const {
  updateApp,
  updateNpub,
  updateViewContextId,
  updateViewWord,
  updateViewWordType,
  updateViewRelationshipType,
} = siteNavigationSlice.actions

export default siteNavigationSlice.reducer
