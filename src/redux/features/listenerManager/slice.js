import { createSlice } from '@reduxjs/toolkit'

export const listenerManagerSlice = createSlice({
  name: 'listenerManager',
  initialState: {
    listening: false,
    application: '', // wiki, twittr, profiles, grapevine, conceptGraph
    filter: {
      kinds: [],
      authors: [],
      since: 0,
    },
  },
  reducers: {
    turnListenerOn: (state, action) => {
      state.listening = true
    },
    turnListenerOff: (state, action) => {
      state.listening = false
    },
    updateListenerApplication: (state, action) => {
      state.application = action.payload
    },
    updateFilter: (state, action) => {
      state.filter = action.payload
    },
    updateFilterKinds: (state, action) => {
      state.filter.kinds = action.payload
    },
    updateFilterAuthors: (state, action) => {
      state.filter.authors = action.payload
    },
    updateSince: (state, action) => {
      state.filter.since = action.payload
    },
    wipeListenerManager: (state, action) => {
      state.listening = false
      state.application = ''
      state.filter = {}
      state.filter.kinds = []
      state.filter.authors = []
      state.filter.since = 0
    },
  },
})

export const {
  turnListenerOn,
  turnListenerOff,
  updateListenerApplication,
  updateFilter,
  updateFilterKinds,
  updateFilterAuthors,
  updateSince,
  wipeListenerManager,
} = listenerManagerSlice.actions

export default listenerManagerSlice.reducer
