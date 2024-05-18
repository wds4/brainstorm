import { createSlice } from '@reduxjs/toolkit'

export const conceptGraphSlice = createSlice({
  name: 'conceptGraph',
  initialState: {
    words: {}, // <cid>: <event>
    byWordType: { // arrays of cids (the cid is also the d-tag (?)); other lookup options may be added, e.g. byName, bySlug, bySet, byConcept / bySet, etc
      wordType: [],
      relationshipType: [],
    },
  },
  reducers: {
    addWordToConceptGraph: (state, action) => {
      const event = action.payload.event
      const cid = action.payload.cid
      const wordType = action.payload.wordType
      // console.log('addWordToConceptGraph; wordType: ' + wordType + '; cid: ' + cid)
      state.words[cid] = event // need event.rawEvent()? or just event?
      if (wordType) {
        if (!state.byWordType[wordType]) {
          state.byWordType[wordType] = []
        }
        if (!state.byWordType[wordType].includes(cid)) {
          state.byWordType[wordType].push(cid)
        }
      }
    },
    wipeConceptGraph: (state, action) => {
      state = {}
      state.words = {}
      state.byWordType = {}
      state.byWordType.wordType = []
      state.byWordType.relationshipType = []
      console.log('wipeConceptGraph')
    },
  },
})

export const { addWordToConceptGraph, wipeConceptGraph } = conceptGraphSlice.actions

export default conceptGraphSlice.reducer

/*
For replaceable events (parameterized: kind 39902), cid will be the naddr;
for non-replaceable (kind 9902), the cid will be the id of the event
*/
