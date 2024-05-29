import { createSlice } from '@reduxjs/toolkit'

export const siteNavigationSlice = createSlice({
  name: 'siteNavigation',
  initialState: {
    loginTime: 0,
    app: 'home', // home, conceptGraph, grapevine, curatedLists, wikifreedia, twittr
    npub: '', // which npub is being viewed on the profile page
    viewContextId: '', // which context is being viewed on the view single context page; is either an event id (if kind 9902) or an naddr (if kind 39902)
    profile: { // ought to move npub here
      tab: 'about', // about, notes, wikis, leaveRating, ratingsOf, ratingsBy, wotScores
    },
    twittr: {
      mainFeed: 'following', // following, global
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
      sortTopicsBy: 'chronological', // alphabetical, reverseAlphabetical, numerical, chronological, wotScore
      sortTopicBy: 'chronological', // chronological, degreesOfSeparation, wotScore, influenceScore
      sortAuthorsBy: 'chronological', // alphabetical, reverseAlphabetical, numerical, chronological, wotScore, influenceScore, degreesOfSeparation
    },
  },
  reducers: {
    updateApp: (state, action) => {
      state.app = action.payload
    },
    updateLoginTime: (state, action) => {
      const currentTime = Math.floor(Date.now() / 1000)
      state.loginTime = currentTime
    },
    updateNpub: (state, action) => {
      state.profile.tab = 'about' // this is a crutch to address the problem that the follows tab doesn't work if it's the first one we see upon initially navigating to a profile
      state.npub = action.payload
    },
    updateViewProfileTab: (state, action) => {
      state.profile.tab = action.payload
    },
    updateTwittrMainFeed: (state, action) => {
      state.twittr.mainFeed = action.payload
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
    updateViewNostrapediaTopic: (state, action) => {
      state.wikifreedia.viewTopic = action.payload
    },
    updateViewNostrapediaArticle: (state, action) => {
      state.wikifreedia.viewArticle = action.payload
    },
    updateViewNostrapediaCategory: (state, action) => {
      state.wikifreedia.viewCategory = action.payload
    },
    updateSortWikiTopicsBy: (state, action) => {
      state.wikifreedia.sortTopicsBy = action.payload
    },
    updateSortSingleTopicBy: (state, action) => {
      state.wikifreedia.sortTopicBy = action.payload
    },
    updateSortWikiAuthorsBy: (state, action) => {
      state.wikifreedia.sortAuthorsBy = action.payload
    },
    wipeSiteNavigation: (state, action) => {
      console.log('wipeSiteNavigation ... currently inactive')
      state.siteNavigation = {}
      state.siteNavigation = {
        loginTime: 0,
        app: 'home', // home, conceptGraph, grapevine, curatedLists, wikifreedia, twittr
        npub: '', // which npub is being viewed on the profile page
        viewContextId: '', // which context is being viewed on the view single context page; is either an event id (if kind 9902) or an naddr (if kind 39902)
        profile: { // ought to move npub here
          tab: 'about', // about, notes, wikis, leaveRating, ratingsOf, ratingsBy, wotScores
        },
        twittr: {
          mainFeed: 'following', // following, global
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
          sortTopicsBy: 'chronological',
          sortTopicBy: 'chronological',
          sortAuthorsBy: 'chronological',
        },
      }
    },
  },
})

export const {
  updateApp,
  updateLoginTime,
  updateNpub,
  updateViewProfileTab,
  updateTwittrMainFeed,
  updateViewContextId,
  updateViewWord,
  updateViewWordType,
  updateViewRelationshipType,
  updateViewNostrapediaTopic,
  updateViewNostrapediaArticle,
  updateViewNostrapediaCategory,
  updateSortWikiTopicsBy,
  updateSortSingleTopicBy,
  updateSortWikiAuthorsBy,
  wipeSiteNavigation,
} = siteNavigationSlice.actions

export default siteNavigationSlice.reducer
