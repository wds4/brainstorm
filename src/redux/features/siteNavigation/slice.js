import { createSlice } from '@reduxjs/toolkit'

export const siteNavigationSlice = createSlice({
  name: 'siteNavigation',
  initialState: {
    app: 'home', // home, conceptGraph, grapevine, curatedLists, wikifreedia, twittr
    npub: '', // which npub is being viewed on the profile page
    viewContextId: '', // which context is being viewed on the view single context page; is either an event id (if kind 9902) or an naddr (if kind 39902)
    profile: { // ought to move npub here
      tab: 'about', // about, notes, wikis, leaveRating, ratingsOf, ratingsBy, wotScores
    },
    grapevine: {}, // ought to move viewContextId here; and add actionId, categoryId
    conceptGraph: {
      viewWord: '', // cid of the word being viewed
      viewWordType: '',
      viewRelationshipType: '',
      viewConceptGraph: '',
      viewConcept: '',
    },
    wikifreedia: {
      viewTopic: '', // string, human readable
      viewArticle: '', // naddr
      viewCategory: '', // human readable string
    },
  },
  reducers: {
    updateApp: (state, action) => {
      state.app = action.payload
    },
    updateNpub: (state, action) => {
      state.npub = action.payload
    },
    updateViewProfileTab: (state, action) => {
      state.profile.tab = action.payload
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
    updateViewWikifreediaTopic: (state, action) => {
      state.wikifreedia.viewTopic = action.payload
    },
    updateViewWikifreediaArticle: (state, action) => {
      state.wikifreedia.viewArticle = action.payload
    },
    updateViewWikifreediaCategory: (state, action) => {
      state.wikifreedia.viewCategory = action.payload
    },
  },
})

export const {
  updateApp,
  updateNpub,
  updateViewProfileTab,
  updateViewContextId,
  updateViewWord,
  updateViewWordType,
  updateViewRelationshipType,
  updateViewWikifreediaTopic,
  updateViewWikifreediaArticle,
  updateViewWikifreediaCategory,
} = siteNavigationSlice.actions

export default siteNavigationSlice.reducer
